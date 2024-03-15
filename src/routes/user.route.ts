import express from "express";
import { signUp } from "../controllers/signup.controller";
import { signupValidationMiddleware } from "../middleware/validation.middleware";


const router = express.Router();

//sign-up
router.post("/signup", signupValidationMiddleware, signUp);

export default router;
