import user from "../models/user.model.js"

const item=new mongoose.Schema({
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
},  { timestamps: true });

const WhatOurCustomerSaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profile_picture: {
        type: String,
        required: true
    },
    name: { 
        type: String,
        required: true
    },

    testimonials: [item]
}, { timestamps: true });

export default mongoose.model("WhatOurCustomerSay", WhatOurCustomerSaySchema);