import mongoose, { Schema, Document } from "mongoose";

interface IFaqItem {
    question: string;
    answer: string;
}

interface IFaqDocument extends Document {
    FAQs: IFaqItem[];
}

const faqSchema = new Schema<IFaqDocument>({
    FAQs: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true }
        }
    ]
});

const FAQ = mongoose.model<IFaqDocument>("FAQ", faqSchema, "HomePData");
export default FAQ;