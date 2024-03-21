import express from "express";
import { signUp } from "../controllers/signup.controller";
import { login } from "../controllers/login.controller";
import { signupValidationMiddleware } from "../middleware/validation.middleware";
import { loginValidationMiddleware } from "../middleware/validation.middleware";


const router = express.Router();

//sign-up
router.post("/signup", signupValidationMiddleware, signUp);

// login
router.post("/login", loginValidationMiddleware, login);

export default router;
