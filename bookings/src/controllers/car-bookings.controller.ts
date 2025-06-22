/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
import { Request, Response } from "express";
import { Booking } from "../models/bookings.model";
import moment from "moment";
import feedbackModel from "../models/feedback.model";

export const getBookedDays = async (req: Request, res: Response) => {
    try {
        const { carID } = req.params;
        const bookings = await Booking.find({
            car: carID,
            status: "reserved"
        }).select("pickUpDate dropOffDate");

        const bookedDaysSet = new Set<string>();
        bookings.forEach(({ pickUpDate, dropOffDate }) => {
            const current = moment(pickUpDate).startOf("day");
            const end = moment(dropOffDate).startOf("day");
            while (current.isSameOrBefore(end)) {
                bookedDaysSet.add(current.format("DD-MM-YYYY"));
                current.add(1, "day");
            }
        });

        const bookedDays = Array.from(bookedDaysSet).sort();
        res.status(200).json({ bookedDays });
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getCarClientReviews = async (req: Request, res: Response) => {
    try {
        const { carID } = req.params;
        const { page = 1, size = 5, sort = "createdAt", direction = "asc" } = req.query;
        const pageNumber = parseInt(page as string) || 1;
        const pageSize = parseInt(size as string) || 5;
        const sortField = sort as string || "createdAt";
        const sortDirection = direction === "desc" ? -1 : 1;
        const skip = (pageNumber - 1) * pageSize;
        const totalReviews = await feedbackModel.countDocuments({ "carId": carID });
        const totalPages = Math.ceil(totalReviews / pageSize);
        const reviews = await feedbackModel.find({ "carId": carID })
            .skip(skip)
            .limit(pageSize)
            .sort({ [sortField]: sortDirection });
        const formattedFeedbacks = await Promise.all(reviews.map(async (review) => {
            try {
                let author = "Unknown User";
                let carImageUrl = "";
                let carModel = "Unknown Car";

                // Get client details
                await new Promise<void>(async (resolve) => {
                    try {
                        const response = await fetch(`https://user-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/users/${review.clientId}/personal-info`);

                        if (response.status === 200) {
                            const json = await response.json();
                            author = `${json.firstName} ${json.lastName}`;
                        } else {
                            console.error("Client API Error:", await response.text());
                        }
                    } catch (error) {
                        console.error("Error fetching client details:", error);
                        if (error instanceof Error) {
                            console.error("Error message:", error.message);
                            console.error("Error stack:", error.stack);
                        }
                    }
                    resolve();
                });

                await new Promise<void>(async (resolve) => {
                    try {
                        const response = await fetch(`https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars/car/${review.carId}`);
                        if (response.status === 200) {
                            const json = await response.json();
                            carImageUrl = json.images[0];
                            carModel = json.model;
                        }
                        else {
                            console.error("Car API Error:", await response.text());
                        }
                    } catch (error) {
                        console.error("Error fetching car details:", error);
                        if (error instanceof Error) {
                            console.error("Error message:", error.message);
                            console.error("Error stack:", error.stack);
                        }
                    }
                    resolve();
                });

                const date = new Date(review.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }).replace(/\//g, ".");

                const orderHistory = `#${review.bookingId.slice(-4)} (${date})`;

                return {
                    author,
                    carImageUrl,
                    carModel,
                    date,
                    feedbackId: review._id,
                    feedbackText: review.feedbackText,
                    orderHistory,
                    rating: review.rating.toString()
                };
            } catch (error) {
                console.error("Error fetching details for feedback:", error);
                return null;
            }
        }));
        const validFeedbacks = formattedFeedbacks.filter(feedback => feedback !== null);
        res.status(200).json({ content: validFeedbacks, currentPage: pageNumber, totalPages, totalReviews });
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
};