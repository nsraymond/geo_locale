import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const DB_URL = process.env.DB_URL;

// connecting to DB
export const connectingToMongoDB = async () => {
    try {
        await mongoose.connect(DB_URL!)
        console.log('Database is connected successfully');
    } catch (error) {
        console.error('Error occurred while connecting to Database:', error);
        process.exit(1);
    }
};
