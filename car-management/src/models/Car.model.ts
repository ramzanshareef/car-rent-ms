const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["ECONOMY", "COMFORT", "BUSINESS", "PREMIUM", "CROSSOVER", "MINIVAN", "ELECTRIC"]
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "BOOKED", "UNAVAILABLE"],
        default: "AVAILABLE"
    },
    gearBoxType: {
        type: String,
        enum: ["MANUAL", "AUTOMATIC"]
    },
    fuelType: {
        type: String,
        enum: ["PETROL", "DIESEL", "ELECTRIC", "HYBRID"]
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
    },
    images: [{
        type: String,
    }],
    engineCapacity: {
        type: String,
    },
    fuelConsumption: {
        type: String,
    },
    passengerCapacity: Number,
    climateControl: {
        type: String,
        enum: ["NONE", "AIR_CONDITIONER", "CLIMATE_CONTROL", "TWO_ZONE_CLIMATE_CONTROL"]
    },
    carRating: {
        type: Number,
        default: 3.5
    },
    serviceRating: {
        type: Number,
        default: 3.5
    }
}, {
    timestamps: true
});

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car;