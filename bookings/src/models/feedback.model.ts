import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
    bookingId: string;
    carId: string;
    clientId: string;
    feedbackText: string;
    rating: number;
    createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
    bookingId: {
        type: String,
        required: true
    },
    carId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    feedbackText: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema, "feedbacks");
