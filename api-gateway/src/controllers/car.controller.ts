import { Request, Response } from "express";
import { buildQueryFromRequest } from "../helpers/request";

export const getAllCars = async (req: Request, res: Response) => {
    try {
        const query = buildQueryFromRequest(req);
        const response = await fetch(`https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars?${query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error(_error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getCarByID = async (req: Request, res: Response) => {
    try {
        const response = await fetch(`https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars/car/${req.params.carID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error(_error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getBookedDaysOfCar = async (req: Request, res: Response) => {
    try {
        const response = await fetch(`https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars/car/${req.params.carID}/booked-days`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error(_error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getClientReviewOfCar = async (req: Request, res: Response) => {
    try {
        const response = await fetch(`https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars/car/${req.params.carID}/reviews`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error(_error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getPopularCars = async (req: Request, res: Response) => {
    try {
        const query = buildQueryFromRequest(req);
        const response = await fetch(`https://car-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/cars/popular-cars?${query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error(_error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};