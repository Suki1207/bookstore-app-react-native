import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // No email, username or password
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password less than 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Username less than 3 characters
    if (!username.length > 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters" });
    }

    // Check if email or username is already in use

    // const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    // if (existingUser) {
    //   return res.status(400).json({ message: "User already exists" });
    // }

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Get random avatar from dicebear.com
    const profileImage = `https://api.dicebear.com/9.x/micah/svg?seed=${username}`;

    // Create new user
    const user = new User({ email, username, password, profileImage });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  res.send("Login");
});

export default router;
