import { Response, NextFunction, Request } from "express";
import { jwtDecode } from "jwt-decode";
import connectDB from "../config/db";
import { User } from "../models/user.model";

interface DecodedToken {
    email: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ error: "Not Authorized" });
    }
    const tokenParts = (token as string).split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        res.status(401).json({ error: "Not Authorized" });
    }
    const tokenValue = tokenParts[1];
    const decodedToken = jwtDecode<DecodedToken>(tokenValue);
    await connectDB();
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
        res.status(401).json({ error: "Not Authorized" });
    }
    next();
};