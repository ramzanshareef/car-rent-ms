import { Request, Response } from "express";
import mongoose from "mongoose";
import { Booking } from "../models/bookings.model";
import { formatDateToMMMDD, formatDateToDDMMYY, formatDateToHHMMDDMMM, formatDateToDDMMYYYY } from "../helpers/date";

export const createBooking = async (req: Request, res: Response) => {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();
    try {
        const { carID, clientID, pickUpDate, pickUpLocationID, dropOffDate, dropOffLocationID } = req.body;
        if ([carID, clientID, pickUpDate, pickUpLocationID, dropOffDate, dropOffLocationID].some((field) => !field)) {
            res.status(422).json({ error: "All Fields are Required" });
            return;
        }
        const pickUpDateObj = new Date(pickUpDate);
        const dropOffDateObj = new Date(dropOffDate);
        if (pickUpDateObj >= dropOffDateObj) {
            res.status(400).json({ error: "Pick Up Date must be before Drop Off Date" });
            return;
        }
        const conflictingBooking = await Booking.findOne({
            car: carID,
            $or: [
                {
                    pickUpDate: { $lt: dropOffDateObj },
                    dropOffDate: { $gt: pickUpDateObj },
                },
            ],
        });
        if (conflictingBooking) {
            res.status(409).json({ error: "Car is already booked for this time frame" });
            return;
        }
        const response = await fetch("https://user-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/users/allAgents", {
            method: "GET"
        });
        const data = await response.json();
        const supportAgents = data.data;
        const randomSupportAgent = supportAgents[Math.floor(Math.random() * supportAgents.length)];
        const booking = await Booking.create({
            car: carID,
            user: clientID,
            supportAgent: randomSupportAgent._id,
            pickUpLocation: pickUpLocationID,
            dropOffLocation: dropOffLocationID,
            pickUpDate: pickUpDateObj,
            dropOffDate: dropOffDateObj,
            madeBy: "client",
            status: "reserved"
        });
        const carDetails = await fetch("https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars/car/" + carID);
        if (!carDetails) {
            res.status(502).json({ error: "Car not found" });
        }
        const car = await carDetails.json();
        await mongooseSession.commitTransaction();
        res.status(201).json({
            message: `New booking was successfully created. \n${car.model} is booked for ${formatDateToMMMDD(pickUpDateObj)} - ${formatDateToMMMDD(dropOffDateObj)} \nYou can change booking details until ${formatDateToHHMMDDMMM(dropOffDateObj)}\nYour order: #${booking._id.toString().slice(0, 5)} (${formatDateToDDMMYY(new Date(booking.createdAt))})`
        });
    } catch (_error) {
        await mongooseSession.abortTransaction();
        // eslint-disable-next-line no-console
        console.error(_error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        mongooseSession.endSession();
    }
};

export const getAllUserBookings = async (req: Request, res: Response) => {
    const userID = req.params.userID;

    try {
        const bookings = await Booking.find({ user: userID });

        const enrichedBookings = await Promise.all(
            bookings.map(async (booking) => {
                let carData = null;

                try {
                    const carRes = await fetch(
                        `https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars/car/${booking.car}`
                    );
                    carData = await carRes.json();
                } catch (_error) {
                    // eslint-disable-next-line no-console
                    console.error("Error fetching car data:", _error);
                }

                return {
                    bookingID: booking._id,
                    bookingStatus: booking.status,
                    carImageUrl: carData?.images?.[0] || null,
                    carModel: carData?.model || "Unknown",
                    orderDetails: `#${booking._id.toString().slice(0, 5)} (${formatDateToDDMMYYYY(booking.createdAt)})`,
                };
            })
        );

        res.status(200).json({ content: enrichedBookings });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error retrieving bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    const bookingID = req.params.bookingID;
    const { clientID, pickUpDate, pickUpLocationID, dropOffDate, dropOffLocationID } = req.body;
    const mongooseSession = await mongoose.startSession();
    try {
        mongooseSession.startTransaction();
        const booking = await Booking.findOne({ _id: bookingID, user: clientID }).session(mongooseSession);
        if (!booking) {
            await mongooseSession.abortTransaction();
            res.status(404).json({ error: "Booking not found" });
            return;
        }

        const newPickUpDate = pickUpDate ? new Date(pickUpDate) : booking.pickUpDate;
        const newDropOffDate = dropOffDate ? new Date(dropOffDate) : booking.dropOffDate;

        if (newPickUpDate >= newDropOffDate) {
            await mongooseSession.abortTransaction();
            res.status(400).json({ error: "Pick Up Date must be before Drop Off Date" });
            return;
        }

        const conflictingBooking = await Booking.findOne({
            _id: { $ne: bookingID },
            car: booking.car,
            $or: [
                {
                    pickUpDate: { $lt: newDropOffDate },
                    dropOffDate: { $gt: newPickUpDate },
                },
            ],
        });

        if (conflictingBooking) {
            await mongooseSession.abortTransaction();
            res.status(409).json({ error: "Car is already booked for this time frame" });
            return;
        }

        if (pickUpDate) booking.pickUpDate = newPickUpDate;
        if (pickUpLocationID) booking.pickUpLocation = pickUpLocationID;
        if (dropOffDate) booking.dropOffDate = newDropOffDate;
        if (dropOffLocationID) booking.dropOffLocation = dropOffLocationID;
        await booking.save({ session: mongooseSession });
        await mongooseSession.commitTransaction();
        res.status(200).json({ message: "Booking updated successfully" });
    } catch (_error) {
        await mongooseSession.abortTransaction();
        // eslint-disable-next-line no-console
        console.error(_error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        mongooseSession.endSession();
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    const bookingID = req.params.bookingID;
    const userID = req.body.userID;
    const mongooseSession = await mongoose.startSession();
    try {
        mongooseSession.startTransaction();
        const booking = await Booking.updateOne(
            { _id: bookingID, user: userID },
            { $set: { status: "cancelled" } },
            { session: mongooseSession }
        );
        if (!booking.modifiedCount) {
            await mongooseSession.abortTransaction();
            res.status(404).json({ error: "Booking not found" });
        }
        await mongooseSession.commitTransaction();
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (_error) {
        await mongooseSession.abortTransaction();
        // eslint-disable-next-line no-console
        console.error(_error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        mongooseSession.endSession();
    }
};

export const getBookingDetails = async (req: Request, res: Response) => {
    const bookingID = req.params.bookingID;
    try {
        const booking = await Booking.findById(bookingID);
        if (!booking) {
            res.status(404).json({ error: "Booking not found" });
        }
        const carDetailsResponse = await fetch(`https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars/car/${booking.car}`);
        const userDetailsResponse = await fetch(`https://user-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/users/${booking.user}/personal-info`);
        if (!carDetailsResponse.ok) {
            res.status(502).json({ error: "Car not found" });
        }
        if (!userDetailsResponse.ok) {
            res.status(502).json({ error: "User not found" });
        }
        const carDetails = await carDetailsResponse.json();
        const userDetails = await userDetailsResponse.json();
        res.status(200).json({ booking, carDetails, userDetails });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error retrieving booking details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
