import express from "express";
import { body } from "express-validator";
import { register, login, refresh } from "../controllers/authController.js";

const router = express.Router();


router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  register
);


router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);


router.post("/refresh", refresh);

export default router;
