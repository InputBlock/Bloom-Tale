import User from "../models/user.model.js";
import { buildGoogleAuthUrl, getVerifiedGoogleProfile } from "../service/google.service.js";
import jwt from "jsonwebtoken";

const createAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRY || "7d" 
  });
};

export const googleLogin = async (req, res) => {
  try {
    const { state } = req.query;
    const url = buildGoogleAuthUrl(state);
    return res.redirect(url);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to initiate Google login"
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Missing authorization code"
      });
    }

    const profile = await getVerifiedGoogleProfile(code);

    const email = profile.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google profile did not include email"
      });
    }

    const provider = "google";
    const providerId = profile.sub || profile.id || "";

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Link Google profile to existing user
      if (!user.metadata) user.metadata = {};
      if (!user.metadata.social_profiles) user.metadata.social_profiles = [];

      const existingProfile = user.metadata.social_profiles.find(
        (p) => p.provider === provider && p.provider_id === providerId
      );

      if (!existingProfile) {
        user.metadata.social_profiles.push({
          provider,
          provider_id: providerId,
          linked_at: new Date()
        });
      }
      user.metadata.google_profile = profile;
    } else {
      // Create new user from Google profile
      const username = profile.name || email.split("@")[0];
      user = new User({
        username,
        email: email.toLowerCase(),
        password_hash: "",
        metadata: {
          social_profiles: [{
            provider,
            provider_id: providerId,
            linked_at: new Date()
          }],
          google_profile: profile
        }
      });
    }

    // Update last login time
    if (!user.metadata) user.metadata = {};
    user.metadata.last_login = new Date();
    await user.save();

    const token = createAccessToken(user._id.toString());
    user.current_token = token;
    await user.save();

    return res.status(200).json({
      success: true,
      access_token: token,
      token_type: "bearer",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Failed to verify Google profile: ${error.message}`
    });
  }
};