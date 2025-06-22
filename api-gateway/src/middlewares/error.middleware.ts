import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    // eslint-disable-next-line no-console
    console.error("Error occurred:", err.message);
    res.status(statusCode);
    res.json({
        error: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};