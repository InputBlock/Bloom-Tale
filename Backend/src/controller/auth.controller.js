import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateOtp } from "../utils/generateOtp.js";
import sendOtpEmail from "../utils/sendOtp.js";

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


const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const otp = generateOtp();

  const user = await User.create({
    email,
    password,
    emailOtp: otp,
    emailOtpExpiry: Date.now() + 10 * 60 * 1000,
  });

  await sendOtpEmail(email, otp);

  // 🔐 verification token
  const verificationToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );

  // 🍪 store token in cookie
  res.cookie("emailVerifyToken", verificationToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000, // 10 min
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      null,
      "OTP sent to your email"
    )
  );
});



export const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const token = req.cookies?.emailVerifyToken;

  if (!otp || !token) {
    throw new ApiError(400, "OTP or verification session expired");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Verification session expired");
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (
    user.emailOtp !== otp ||
    user.emailOtpExpiry < Date.now()
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.isEmailVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  // 🧹 clear cookie after success
  res.clearCookie("emailVerifyToken");

  return res.json(
    new ApiResponse(200, null, "Email verified successfully")
  );
});



export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // 2️⃣ Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3️⃣ Block unverified users
  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  // 4️⃣ Check password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 5️⃣ Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // 6️⃣ Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // 7️⃣ Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // 8️⃣ Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
          },
        },
        "Login successful"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  // remove refresh token from DB
  if (refreshToken) {
    await User.findOneAndUpdate(
      { refreshToken },
      { $unset: { refreshToken: 1 } }
    );
  }

  // clear cookies
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, null, "Logout successful"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate OTP
  const otp = generateOtp();
  user.emailOtp = otp;
  user.emailOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save({ validateBeforeSave: false });

  // Send OTP email
  await sendOtpEmail(email, otp);

  // 🔑 Create reset token
  const resetPasswordToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );

  // 🍪 Store token in HTTP-only cookie
  res.cookie("resetPasswordToken", resetPasswordToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000, // 10 min
  });

  return res.status(200).json(
    new ApiResponse(200, null, "OTP sent to email")
  );
});



export const resetPassword = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;
  const token = req.cookies?.resetPasswordToken;

  if (!otp || !newPassword || !token) {
    throw new ApiError(400, "OTP or reset session expired");
  }

  // Decode reset token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Reset session expired");
  }

  const user = await User.findById(decoded.userId);
  if (
    !user ||
    user.emailOtp !== otp ||
    user.emailOtpExpiry < Date.now()
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Update password (hashed by mongoose hook)
  user.password = newPassword;
  user.emailOtp = undefined;
  user.emailOtpExpiry = undefined;
  user.refreshToken = undefined; // logout all sessions

  await user.save();

  // 🧹 Clear reset cookie
  res.clearCookie("resetPasswordToken");

  return res.status(200).json(
    new ApiResponse(200, null, "Password reset successful")
  );
});


export { registerUser };