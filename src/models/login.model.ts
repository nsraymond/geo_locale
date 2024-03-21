import mongoose, { Schema, Document, Model } from 'mongoose';

export interface UserDocument extends Document {
    email: string;
    password: string;
    apiKey: string;
}

const userSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true }
});

// Define UserModel as a singleton
let UserModel: Model<UserDocument>;

try {
    // If UserModel is already defined, use it
    UserModel = mongoose.model<UserDocument>('User');
} catch (error) {
    // If UserModel is not defined, define and compile it
    UserModel = mongoose.model<UserDocument>('User', userSchema);
}

export { UserModel };
