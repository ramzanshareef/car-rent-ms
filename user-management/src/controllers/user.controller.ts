import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await User.find({ role: "Client" });
        res.status(200).json({
            data: clients,
            message: "Clients fetched successfully",
        });
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.log(_error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllAgents = async (req: Request, res: Response) => {
    try {
        const agents = await User.find({ role: "Support" });
        res.status(200).json({
            data: agents,
            message: "Agents fetched successfully",
        });
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.log(_error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};