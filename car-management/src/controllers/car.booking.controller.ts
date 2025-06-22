import { Request, Response } from "express";

export const getBookedDays = async (req: Request, res: Response) => {
    const { carID } = req.params;
    const response = await fetch("https://bookings-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/bookings/car/" + carID + "/booked-days", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    res.status(response.status).json(await response.json());
};

export const getCarReviews = async (req: Request, res: Response) => {
    const { carID } = req.params;
    const response = await fetch("https://bookings-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/bookings/car/" + carID + "/reviews" + formatQueryParams(req), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    res.status(response.status).json(await response.json());
};

function formatQueryParams(req: Request): string {
    const queryParams = new URLSearchParams(req.query as Record<string, string>);
    return queryParams.toString() ? `?${queryParams.toString()}` : '';
}