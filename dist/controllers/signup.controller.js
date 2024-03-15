"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const existingUser = yield user_model_1.UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const apiKey = Math.random().toString(36).substring(2) + email.slice(0, 3); // Generate API key
        const token = jsonwebtoken_1.default.sign({ email, apiKey }, JWT_SECRET); // Generate JWT token with apiKey embedded
        const newUser = new user_model_1.UserModel({
            username,
            email,
            password: hashedPassword,
            apiKey
        });
        yield newUser.save();
        res.status(201).json({ token });
    }
    catch (error) {
        console.error('Sign-up error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.signUp = signUp;
