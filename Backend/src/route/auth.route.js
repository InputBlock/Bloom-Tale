import { Router } from "express";
import {
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleCallback
} from "../controller/auth.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/verifyOtp", verifyOtp);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

// Google OAuth routes
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

// Protected routes (example)


export default router;
