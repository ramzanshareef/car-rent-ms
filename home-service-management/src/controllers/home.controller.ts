import { Request, Response } from "express";
import About from "../models/about.model";
import FAQ from "../models/faq.model";
import Location from "../models/location.model";
import mongoose from "mongoose";

export const getAboutUs = async (req: Request, res: Response) => {
    try {
        const data = await About.find();
        if (!data) {
            res.status(404).json({ error: "Requested resource not found" });
            return;
        }
        res.status(200).json({ content: data[0].AboutUs });


    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("About Us Error:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getFaq = async (req: Request, res: Response) => {
    try {
        const data = await FAQ.find();
        if (!data || data.length === 0) {
            res.status(404).json({ error: "Requested resource not found" });
            return;
        }
        const content = data[0].FAQs.map(({ question, answer }) => (
            {
                question: question,
                answer: answer
            }
        ));
        res.status(200).json({ content: content });

    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("FAQ Error:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getLocations = async (req: Request, res: Response) => {

    try {
        const data = await Location.find();
        res.status(200).json({ content: data });

    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Location Error:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getLocationById = async (req: Request, res: Response) => {
    const locationId = req.params.locationID;
    try {
        const data = await Location.findOne({ _id: new mongoose.Types.ObjectId(locationId) });
        res.status(200).json({ content: data });
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Location By ID Error:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};