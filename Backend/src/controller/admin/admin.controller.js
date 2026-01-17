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

    return res.status(200).json(
        new ApiResponse(200, result, "Admin login successful")
    );
});

export default admin_login;