import mongoose, { Schema, Document } from "mongoose";

interface IAboutItem {
    title: string;
    numericValue: string;
    description: string;
}

interface IAboutUs {
    years: IAboutItem;
    locations: IAboutItem;
    carBrands: IAboutItem;
    cars: IAboutItem;
}

interface IAboutDocument extends Document {
    AboutUs: IAboutUs;
}

const AboutUsMetricSchema = new Schema<IAboutItem>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    numericValue: { type: String, required: true },
}, { _id: false });

const AboutUsSchema = new Schema<IAboutUs>({
    years: { type: AboutUsMetricSchema, required: true },
    locations: { type: AboutUsMetricSchema, required: true },
    carBrands: { type: AboutUsMetricSchema, required: true },
    cars: { type: AboutUsMetricSchema, required: true },
}, { _id: false });

const AboutSchema = new Schema<IAboutDocument>({
    AboutUs: { type: AboutUsSchema, required: true },
});

const About = mongoose.model<IAboutDocument>("About", AboutSchema, "HomePData");
export default About;