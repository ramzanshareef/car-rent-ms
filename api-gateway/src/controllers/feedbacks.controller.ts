import { Request, Response } from "express";

export const createFeedback = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://bookings-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/feedbacks/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error creating feedback:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getRecentFeedbacks = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://bookings-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/feedbacks/recent", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching recent feedbacks:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};