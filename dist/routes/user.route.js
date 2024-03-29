"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_controller_1 = require("../controllers/signup.controller");
const login_controller_1 = require("../controllers/login.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const validation_middleware_2 = require("../middleware/validation.middleware");
const router = express_1.default.Router();
//sign-up
router.post("/signup", validation_middleware_1.signupValidationMiddleware, signup_controller_1.signUp);
// login
router.post("/login", validation_middleware_2.loginValidationMiddleware, login_controller_1.login);
exports.default = router;
