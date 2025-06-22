import { Request, Response } from "express";

export const createBooking = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://bookings-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/bookings/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error creating booking:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getClientsAllBookings = async (req: Request, res: Response) => {
    try {
        const response = await fetch(`https://bookings-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/bookings/${req.params.userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching client's bookings:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const response = await fetch(`https://bookings-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/bookings/${req.params.bookingID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error deleting booking:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    try {
        const response = await fetch(`https://bookings-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/bookings/${req.params.bookingID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error updating booking:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const response = await fetch(`https://bookings-run8-2-team5-node-prod.development.krci-dev.cloudmentor.academy/api/bookings/booking/${req.params.bookingID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        res.status(response.status).json(await response.json());
    } catch (_error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching booking by ID:", _error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};