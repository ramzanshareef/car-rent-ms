import { Request, Response } from "express";
import mongoose from "mongoose";
import Car from "../models/Car.model";

export const getPopularCars = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const queryParams = req.query || {};
        const { category = "", size = 4 } = queryParams as { category?: string; size?: string | number };
        let data = [];
        const basePipeline = [
            {
                $project: {
                    carId: "$_id",
                    _id: 0,
                    carRating: 1,
                    imageUrl: { $arrayElemAt: ["$images", 0] },
                    model: 1,
                    pricePerDay: 1,
                    serviceRating: 1,
                    status: 1,
                    category: 1,
                    location: 1,
                },
            },
            {
                $sort: {
                    carRating: -1,
                    serviceRating: -1,
                }
            },
            {
                $limit: parseInt(size as string, 10),
            },
        ];

        if (category) {
            data = await Car.aggregate([
                { $match: { category } },
                ...basePipeline
            ]).session(session);
        } else {
            data = await Car.aggregate(basePipeline).session(session);
        }
        await Promise.all(
            data.map(async (car: any) => {
                if (car.location) {
                    try {
                        const response = await fetch(
                            `https://home-service-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/home/locations/${car.location}`
                        );
                        if (response.status === 200) {
                            const json = await response.json();
                            car.location = json.content.locationName;
                        } else {
                            car.location = "Unknown Location";
                        }
                    } catch {
                        car.location = "Unknown Location";
                    }
                } else {
                    car.location = "Unknown Location";
                }
            })
        );
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ content: data });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};