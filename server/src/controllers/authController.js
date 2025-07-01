// src/controllers/authController.js
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { generateToken, verifyToken } from "../utils/jwt.js";

// ✅ Register
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ 
        success: false,
        message: "Validation failed",
        errors: errors.array() 
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Email already registered" 
      });
    }

    const user = await User.create({ name, email, password }); // hashed in model
    const token = generateToken({ id: user._id });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      }
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Login
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ 
        success: false,
        message: "Validation failed",
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const token = generateToken({ id: user._id });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      }
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Refresh Token
export const refresh = (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: "Token required" 
      });
    }

    const payload = verifyToken(token);
    const newToken = generateToken({ id: payload.id });

    res.status(200).json({ 
      success: true,
      message: "Token refreshed successfully",
      data: { token: newToken }
    });
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};
