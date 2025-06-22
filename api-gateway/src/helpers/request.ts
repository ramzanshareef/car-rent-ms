import { Request } from "express";

export const buildQueryFromRequest = (req: Request): string => {
    let query: string = "";
    const params = new URLSearchParams(req.query as Record<string, string>);
    params.forEach((value, key) => {
        if (value) {
            query += `${key}=${encodeURIComponent(value)}&`;
        }
    });
    return query.slice(0, -1);
};