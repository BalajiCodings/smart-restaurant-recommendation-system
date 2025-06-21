import express from "express";
import { body } from "express-validator";
import { register, login, refresh } from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty(),
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  login
);
router.post("/refresh", refresh);

export default router;