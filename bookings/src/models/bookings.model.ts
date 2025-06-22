import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    supportAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SupportAgent",
        default: null
    },
    status: {
        type: String,
        required: true,
    },
    pickUpDate: {
        type: Date,
        required: true,
    },
    dropOffDate: {
        type: Date,
        required: true,
    },
    pickUpLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },
    dropOffLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },
    madeBy: {
        type: String,
        enum: ["client", "support"],
        default: "client"
    }
}, {
    timestamps: true
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export { Booking };