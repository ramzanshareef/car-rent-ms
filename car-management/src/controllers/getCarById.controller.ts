import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Car from "../models/Car.model";

export const getCarById = async (req: Request, res: Response, next: NextFunction) => {
    const { carId } = req.params;

    if (!carId) {
        res.status(400);
        return next(new Error("Missing carId parameter"));
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let car = await Car.findById(carId).session(session);
        if (!car) {
            res.status(404).json({ message: "Car not found" });
        }
        car = car.toObject();
        await new Promise<void>(async (resolve) => {
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
            resolve();
        });
        await session.commitTransaction();
        res.status(200).json(car);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
}