import mongoose, { Document, Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  userId:string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema({
  userId: { type: String, unique:true,default: uuidv4 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Client", "Support", "Admin"], default: "Client" },
  createdAt: { type: Date, default: Date.now }
},{
  collection: "users",
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);