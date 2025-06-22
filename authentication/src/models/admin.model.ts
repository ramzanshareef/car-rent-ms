import mongoose, { Document, Model } from "mongoose";

export interface IAdmin extends Document {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

const adminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
},
{
    collection: "admin",
  }
);

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);