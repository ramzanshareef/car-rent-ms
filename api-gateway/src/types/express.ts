import { Request } from "express";
import mongoose from "mongoose";

export interface ExtendedRequest extends Request {
    user?: {
        _id: mongoose.Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        userId: string; // Cognito User Pool ID
        createdAt: Date;
        updatedAt: Date;
    };
}