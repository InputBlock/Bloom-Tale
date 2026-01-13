import { Router } from "express";
import {
  registerUser,
//   loginUser,
//   logoutUser,
//   refreshAccessToken,
} from "../controller/auth.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/refresh-token", refreshAccessToken);

// Protected routes
// router.post("/logout", verifyJWT, logoutUser);
// router.get("/me", verifyJWT, (req, res) => {
//   res.status(200).json({
//     success: true,
//     user: req.user,
//   });
// });

export default router;
