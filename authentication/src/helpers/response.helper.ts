import { Response } from "express";

type ResponseBody =
    | { message: string; error?: never }
    | { error: string; message?: never };

export const formatResponse = (res: Response, statusCode: number, body: ResponseBody) => {
    return res.status(statusCode).json(body);
};