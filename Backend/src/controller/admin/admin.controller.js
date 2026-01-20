import AdminDecorator from "../../admin/decorator.admin.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const admin_login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
        throw new ApiError(400, "Email is required");
    }
    if (!password) {
        throw new ApiError(400, "Password is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new ApiError(400, "Invalid email format");
    }

    const ctx = {
        email: email.trim().toLowerCase(),
        password: password
    };
    const result = await AdminDecorator(ctx);

    // Set httpOnly cookie for secure authentication
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    return res
        .status(200)
        .cookie("adminToken", result.token, cookieOptions)
        .json(new ApiResponse(200, { admin: result.admin }, "Admin login successful"));
});

export const admin_logout = asyncHandler(async (req, res) => {
    // Clear httpOnly cookie
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: new Date(0), // Expire immediately
    };

    return res
        .status(200)
        .cookie("adminToken", "", cookieOptions)
        .json(new ApiResponse(200, null, "Logged out successfully"));
});

export default admin_login;