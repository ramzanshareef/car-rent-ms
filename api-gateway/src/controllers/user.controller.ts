import { Request, Response } from "express";

export const changePassword = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: "Password changed successfully" });
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error changing password:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getPersonalInfo = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://user-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/users/" + req.params.userID + "/personal-info", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching personal info:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updatePersonalInfo = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://user-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/users/" + req.params.userID + "/personal-info", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error updating personal info:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAgents = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://user-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/users/allAgents", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching agents:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getClients = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://user-management-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/users/allClients", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching clients:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};