import mongoose, { Document, Model } from "mongoose";

export interface ISupportAgent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

const supportAgentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
},
{
    collection: "supportAgent",
});

export const SupportAgent: Model<ISupportAgent> = mongoose.model<ISupportAgent>("SupportAgent", supportAgentSchema);