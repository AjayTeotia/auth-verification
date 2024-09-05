import { User } from "../models/user.model.js";

import httpStatus from "http-status";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/email.js";

// Signup auth controller route
export const signup = async (req, res) => {
  //res.send("Signup route");
  const { email, password, name } = req.body;

  try {
    // Check if all fields are filled
    if (!email || !password || !name) {
      throw new Error("PLEASE FILL OUT ALL FIELDS");
    }

    // Check if user already exists
    const userAlreadyExists = await User.findOne({ email });

    // If user already exists, throw error
    if (userAlreadyExists) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: false, message: "USER STILL EXISTS" });
    }

    // Hashed password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // verification Code Expires
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    // New User
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      verificationCode,
      verificationCodeExpires,
    });

    // To sava new user data
    await newUser.save();

    // JWT token
    generateTokenAndSetCookie(res, newUser._id);

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationCode);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "USER CREATED SUCCESSFULLY",
      newUser: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(`ERROR IN SIGNUP CONTROLLER: ${error.message}`);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// Verify email auth controller route
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const newUser = await User.findOne({
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() },
    });

    // Check verification code is correct or not
    if (!newUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "INVALID OR EXPIRED VERIFICATION CODE",
      });
    }

    newUser.isVerified = true;
    newUser.verificationCode = undefined;
    newUser.verificationCodeExpires = undefined;

    // Update user data
    await newUser.save();

    // Send welcome email
    await sendWelcomeEmail(newUser.email, newUser.name);

    res.status(httpStatus.OK).json({
      success: true,
      message: "EMAIL VERIFIED SUCCESSFULLY",
      newUser: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("ERROR VERIFYING EMAIL", error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

// Login auth controller route
export const login = async (req, res) => {
  //res.send("Login route");

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Compare password with hashed password
    const isPasswordMatch = await bcryptjs.compare(
      password,
      user?.password || ""
    );

    // Check if user exists and password is correct
    if (!email || !isPasswordMatch) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "INVALID CREDENTIALS",
      });
    }

    // JWT token
    generateTokenAndSetCookie(res, user._id);

    // Update last login
    user.lastLogin = Date.now();

    await user.save();

    res.status(httpStatus.OK).json({
      success: true,
      message: "LOGGED IN SUCCESSFULLY",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(`ERROR IN LOGIN CONTROLLER: ${error.message}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL SERVER ERROR" });
  }
};

// Logout auth controller route
export const logout = async (req, res) => {
  //res.send("Logout route");

  try {
    res.clearCookie("token");
    res.status(httpStatus.OK).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(`ERROR IN LOGOUT CONTROLLER: ${error.message}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL SERVER ERROR" });
  }
};

// Forget password link auth controller route
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(httpStatus.BAD_GATEWAY)
        .json({ success: false, message: "USER NOT FOUND" });
    }

    // Generate password reset code
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "PASSWORD RESET EMAIL SENT SUCCESSFULLY",
    });
  } catch (error) {
    console.log(`ERROR IN FORGOT PASSWORD CONTROLLER: ${error.message}`);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
    });
  }
};

// Reset password auth controller route
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "INVALID OR EXPIRED PASSWORD RESET TOKEN",
      });
    }

    // Hashed password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(httpStatus.OK).json({
      success: true,
      message: "PASSWORD RESET SUCCESSFULLY",
    });
  } catch (error) {
    console.log(`ERROR IN FORGOT PASSWORD CONTROLLER: ${error.message}`);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
    });
  }
};
