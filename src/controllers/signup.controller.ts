import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';


//signup
export const signUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = Math.random().toString(36).substring(2) + email.slice(0, 3); // Generate API key
        const token = jwt.sign({ email, apiKey }, JWT_SECRET); // Generate JWT token with apiKey embedded
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            apiKey
        });
        await newUser.save();
        res.status(201).json({ token });
    } catch (error) {
        console.error('Sign-up error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
