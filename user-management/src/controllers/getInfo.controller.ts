import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";  // mongoose User model

const DEBUG_MODE = process.env.DEBUG_MODE || "false";

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    try {
        // Fetch user from mongoose
        const user = await User.findOne({ _id: userId }).select("-password").exec();

        if (user) {
            const userObj = user.toObject();
            userObj.client_id = userObj._id;
            delete userObj._id;
            delete userObj.userId;

            // Return the user object directly without nesting it under "user"
            res.status(200).json(userObj);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error("Get user info error:", err);
        res.status(500);
        if (DEBUG_MODE === "true") {
            return next(new Error(`Get user info failed: ${err.message}\n${err.stack}`));
        }
        return next(new Error("Get user info failed"));
    }
};