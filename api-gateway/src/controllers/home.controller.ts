import { Request, Response } from "express";

export const getAboutUs = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://home-service-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/home/about-us", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching About Us:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFAQ = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://home-service-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/home/faq", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching FAQ:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getLocations = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://home-service-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/home/locations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching Locations:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};