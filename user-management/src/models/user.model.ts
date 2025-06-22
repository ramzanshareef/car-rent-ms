import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["Client", "Admin", "Support"],
        default: "Client"
    },
    userId: { // Cognito User Pool ID
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    strict: false,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };