import mongoose from "mongoose";

const item = new mongoose.Schema({
    testimonial: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, 
        max: 5
    }
}, { timestamps: true });

const WhatOurCustomerSaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profile_picture: {
        type: String,
        default: ""
    },
    name: { 
        type: String,
        required: true
    },

    testimonials: [item]
}, { timestamps: true });

export default mongoose.model("WhatOurCustomerSay", WhatOurCustomerSaySchema);