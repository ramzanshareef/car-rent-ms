import { Request, Response } from "express";
import axios from "axios";
import { formatResponse } from "../helpers/response.helper";

const API_URL = "https://bnrjm4j5x5.execute-api.eu-north-1.amazonaws.com/dev/auth/sign-up";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validatePassword = (password: string): boolean => {
    return PASSWORD_REGEX.test(password);
};

const validateEmail = (email: string): boolean => {
    return /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const validateRequiredFields = (fields: { [key: string]: any }): string | null => {
    const missingFields = Object.entries(fields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    return missingFields.length > 0
        ? `Missing required fields: ${missingFields.join(', ')}`
        : null;
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const validationError = validateSignUpInput({ email, password, firstName, lastName });
        if (validationError) {
            formatResponse(res, 400, { error: validationError });
            return;
        }

        await axios.post(API_URL, { email, password, firstName, lastName });

        formatResponse(res, 201, { message: "User successfully created" });
    } catch (err: any) {
        handleSignUpError(err, res);
    }
};

function validateSignUpInput(data: { email: string; password: string; firstName: string; lastName: string }): string | null {
    const { email, password, firstName, lastName } = data;

    const missingFieldsError = validateRequiredFields({ email, password, firstName, lastName });
    if (missingFieldsError) return missingFieldsError;

    if (!validateEmail(email)) return "Invalid email format.";

    if (!validatePassword(password)) {
        return "Password must include letters, numbers, and special characters, and be at least 8 characters.";
    }

    return null;
}

function handleSignUpError(err: any, res: Response): void {
    console.error("Signup error:", err);

    let status = 500;
    let error = "Signup failed.";

    if (err.response) {
        const errorText = err.response.data?.error?.toLowerCase() || "";
        const code = err.response.status;

        if (errorText.includes("already exists") || code === 409) {
            status = 409;
            error = "User already exists";
        } else if (
            errorText.includes("password") ||
            errorText.includes("invalid password") ||
            errorText.includes("password format")
        ) {
            status = 400;
            error = "Password must include letters, numbers, and special characters, and be at least 8 characters.";
        } else {
            error = err.response.data.message || "Signup failed.";
            status = code;
        }
    } else if (err.request) {
        error = "Network error occurred. Please try again.";
    }

    const errorResponse: any = { error };
    if (process.env.DEBUG_MODE === "true") {
        errorResponse.error = err.message;
        errorResponse.stack = err.stack;
        errorResponse.details = err;
    }

    formatResponse(res, status, errorResponse);
}