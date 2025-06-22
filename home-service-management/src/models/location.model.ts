import mongoose, { Schema } from "mongoose";

const locSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mapQuery: {
        type: String,
        required: true
    }
});

const Location = mongoose.model("location", locSchema);
export default Location;