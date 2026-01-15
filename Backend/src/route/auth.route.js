import { Router } from "express";
import {
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword
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

// router.get("/me", verifyJWT, (req, res) => { 
//   res.status(200).json({
//     success: true,
//     user: req.user,
//   });
// });

export default router;
