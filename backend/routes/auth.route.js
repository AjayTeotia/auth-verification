import express from "express";

import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Verify email route
router.post("/verify-email", verifyEmail);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

// Forgot Password route
router.post("/forgot-password", forgotPassword);

// Reset Password route
router.post("/reset-password/:token", resetPassword);

export default router;
