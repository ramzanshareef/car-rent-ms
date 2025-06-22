import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

const DEBUG_MODE = process.env.DEBUG_MODE || "false";

export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    try {
        // Find the user
        const user = await User.findOne({ _id: userId }).select("-password").exec();
        if (!user) {
            res.status(404);
            return next(new Error("User not found"));
        }

        // Extract fields from request body
        const {
            firstName,
            lastName,
            phone,
            country,
            city,
            postalCode,
            street,
            userImageUrl,
        } = req.body;

        // Validate input
        if (/\s/.test(firstName)) {
            res.status(400);
            return next(new Error("Blank spaces are not allowed in firstName"));
        }

        if (/\s/.test(lastName)) {
            res.status(400);
            return next(new Error("Blank spaces are not allowed in lastName"));
        }

        if (!/^[A-Za-z]+$/.test(firstName)) {
            res.status(400);
            return next(new Error("Only latin letters allowed for firstName and lastName"));
        }

        if (!/^[A-Za-z]+$/.test(lastName.trim())) {
            res.status(400);
            return next(new Error("Only latin letters allowed for firstName and lastName"));
        }

        if (postalCode && /\s/.test(postalCode)) {
            res.status(400);
            return next(new Error("Blank spaces are not allowed in postalCode"));
        }

        // Update user
        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    firstName,
                    lastName,
                    phone,
                    country,
                    city,
                    postalCode,
                    street,
                    userImageUrl,
                    updatedAt: new Date(),
                },
            }
        );

        // Get updated user
        const updatedUser = await User.findOne({ _id: userId }).select("-password").exec();
        if (!updatedUser) {
            res.status(404);
            return next(new Error("User not found"));
        }

        // Format response
        const responseBody = {
            user: {
                city: updatedUser.city || "",
                client_id: updatedUser._id,
                country: updatedUser.country || "",
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                imageUrl: updatedUser.userImageUrl || "",
                lastName: updatedUser.lastName,
                phone: updatedUser.phone || "",
                postalCode: updatedUser.postalCode || "",
                street: updatedUser.street || "",
            },
        };

        res.status(200).json(responseBody);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error("Update user info error:", err);
        res.status(500);
        if (DEBUG_MODE === "true") {
            return next(new Error(`Update user info failed: ${err.message}\n${err.stack}`));
        }
        return next(new Error("Update user info failed"));
    }
};