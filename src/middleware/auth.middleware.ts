import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || '123456';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.headers['x-api-key'] || req.query.apiKey || req.body.apiKey;
        if (!apiKey) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        const decoded = jwt.verify(apiKey, JWT_SECRET) as JwtPayload;
        const userEmail = decoded.email;
        const user = await UserModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid API key' });
        }
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
