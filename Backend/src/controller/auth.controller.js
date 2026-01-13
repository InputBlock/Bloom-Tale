import User from "../models/user.model.js";
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



import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"

import { ApiResponse } from "../utils/ApiResponse.js";

import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

import { generateOtp } from "../utils/generateOtp.js";
import sendOtpEmail from "../utils/sendOtp.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Validate
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // 2️⃣ Check existing user
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // 3️⃣ Generate OTP
  const otp = generateOtp();

  // 4️⃣ Create user
  const user = await User.create({
    email,
    password,
    emailOtp: otp,
    emailOtpExpiry: Date.now() + 10 * 60 * 1000, // 10 min
  });

  // 5️⃣ Send OTP email
  await sendOtpEmail(email, otp);

  // 6️⃣ Response (do NOT auto-login)
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        userId: user._id,
        email: user.email,
      },
      "OTP sent to your email. Please verify."
    )
  );
});


const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

export { registerUser };