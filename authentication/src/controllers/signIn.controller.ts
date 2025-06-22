import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import { formatResponse } from "../helpers/response.helper";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const CLIENT_ID = process.env.cup_client_id!;
const REGION = process.env.AWS_REGION || "eu-north-1";
const DEBUG_MODE = process.env.DEBUG_MODE === "true";

const cognito = new CognitoIdentityProviderClient({ region: REGION });

export const signIn = async (req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return void formatResponse(res, 400, { error: "Email and password are required." });
        }

        const authCmd = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        });

        const cognitoResponse = await cognito.send(authCmd);

        // Step 2: Find user from MongoDB (excluding password)
        const user = await User.findOne({ email }).select("-password").session(session) as (typeof User)["prototype"] | null;

        if (!user) {
            return void formatResponse(res, 404, { error: "User not found." });
        }

        const responseBody = {
            message: "Login successful.",
            user: {
                idToken: cognitoResponse.AuthenticationResult?.IdToken,
                role: user.role,
                userId: user._id.toString(),
                userImageUrl: user.userImageUrl || "Image not found",
                username: `${user.firstName} ${user.lastName}`,
            },
        };

        await session.commitTransaction();
        return void formatResponse(res, 200, responseBody);
    } catch (err: any) {
        await session.abortTransaction();
        console.error("Login error:", err);

        if (err.name === "NotAuthorizedException") {
            return void formatResponse(res, 401, { error: "Invalid email or password." });
        }

        const errorResponse: any = {
            error: "Login failed.",
        };

        if (DEBUG_MODE) {
            errorResponse.error = err.message;
            errorResponse.stack = err.stack;
            errorResponse.details = err;
        }

        return void formatResponse(res, 500, errorResponse);
    } finally {
        session.endSession();
    }
};