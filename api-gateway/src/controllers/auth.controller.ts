import { Request, Response } from "express";

export const signIn = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://authentication-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/auth/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error during Sign In", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const signUp = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://authentication-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/auth/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error during Sign Up", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};