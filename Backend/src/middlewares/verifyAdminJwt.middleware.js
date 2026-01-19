import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to verify admin JWT token
 * Checks httpOnly cookies first (secure), then Authorization header as fallback
 * Validates token and verifies user has admin privileges
 */
export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  // 1️⃣ Get access token from httpOnly cookie (primary - secure)
  let token = req.cookies?.adminToken;
  
  // Fallback to Authorization header (for API clients)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized: No admin access token");
  }

  // 2️⃣ Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, "Admin token has expired");
    }
    throw new ApiError(401, "Invalid admin access token");
  }

  // 3️⃣ Check if token has admin role
  if (decoded.role !== 'admin') {
    throw new ApiError(403, "Forbidden: Admin access required");
  }

  // 4️⃣ Get admin from DB (use 'id' from token payload)
  const adminId = decoded.id || decoded._id;
  const admin = await Admin.findById(adminId).select("-password_hash");

  if (!admin) {
    throw new ApiError(401, "Admin not found");
  }

  if (!admin.is_admin) {
    throw new ApiError(403, "Forbidden: User is not an admin");
  }

  // 5️⃣ Attach admin to request
  req.admin = admin;

  next();
});

export default verifyAdminJWT;
