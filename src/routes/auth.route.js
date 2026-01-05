import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../constant/auth.constant.js";
import { userModel } from "../db-model/user-model.js";
import { v4 as uuidv4 } from "uuid";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  const payload = req.user;
  res.status(200).json({
    success: true,
    user: payload,
  });
});
// SIGNUP API
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Email, name, password are required" });

    const existing = await userModel.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "user already exists" });

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create new user with unique userId
    const userId = uuidv4();
    const user = new userModel({
      userId: userId,
      name,
      email,
      password: hash,
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId, name: user.name, email: user.email },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN || "7d",
      }
    );

    // Set token in HTTP-only cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send token in response and user info
    res.status(201).json({
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN API
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Password not matched" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, name: user.name, email: user.email },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN || "7d",
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 5 * 24 * 60 * 60 * 1000,
      //         1day   1hour  1min    1sec
    };

    res.cookie("accessToken", token, options);
    // Send token in response and user info
    res.json({
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getHealth = async (req, res) => {
  try {
    res.json({
      status: true,
      message: "App working fine",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Define routes for signup and login
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate);
router.get("/health", getHealth);
export default router;
