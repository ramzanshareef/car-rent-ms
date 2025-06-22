/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
import { Request, Response } from "express";
import Feedback from "../models/feedback.model";

export const createFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bookingId, carId, clientId, feedbackText, rating } = req.body;

        // Validate required fields
        if (!bookingId || !carId || !clientId || !rating) {
            res.status(400).json({
                message: "All fields are required: bookingId, carId, clientId and rating"
            });
            return;
        }

        // Validate rating is a number between 0 and 5
        if (isNaN(rating) || rating < 0 || rating > 5) {
            res.status(400).json({
                message: "Rating must be a number between 0 and 5"
            });
            return;
        }

        // Create new feedback
        const feedback = new Feedback({
            bookingId,
            carId,
            clientId,
            feedbackText,
            rating: Number(rating)
        });

        // Save feedback to database
        const savedFeedback = await feedback.save();

        // Return success response with feedbackId
        res.status(201).json({
            feedbackId: savedFeedback._id,
            systemMessage: "Feedback has been successfully created"
        });

    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const getRecentFeedbacks = async (req: Request, res: Response): Promise<void> => {
    try {
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 })
            .limit(10);

        const formattedFeedbacks = await Promise.all(feedbacks.map(async (feedback) => {
            try {
                let author = "Unknown User";
                let carImageUrl = "";
                let carModel = "Unknown Car";

                // Get client details
                await new Promise<void>(async (resolve) => {
                    try {
                        const response = await fetch(`https://user-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/users/${feedback.clientId}/personal-info`);

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
                        const response = await fetch(`https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars/car/${feedback.carId}`);
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

                const date = new Date(feedback.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }).replace(/\//g, ".");

                const orderHistory = `#${feedback.bookingId.slice(-4)} (${date})`;

                return {
                    author,
                    carImageUrl,
                    carModel,
                    date,
                    feedbackId: feedback._id,
                    feedbackText: feedback.feedbackText,
                    orderHistory,
                    rating: feedback.rating.toString()
                };
            } catch (error) {
                console.error("Error fetching details for feedback:", error);
                return null;
            }
        }));

        const validFeedbacks = formattedFeedbacks.filter(feedback => feedback !== null);

        res.status(200).json({
            content: validFeedbacks
        });

    } catch (error) {
        console.error("Error fetching recent feedbacks:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};