const mongoose = require("mongoose");

const MiscellaneousSchema = new mongoose.Schema({
    dist: {
        five: {
            type: Number,
            default: 0
        },
        ten: {
            type: Number,
            default: 0
        },
        twenty: {
            type: Number,
            default: 0
        },
        thirty: {
            type: Number,
            default: 0
        }
    },
    faq: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    }],
    tnc: {
        type: String
    },
    shippingPolicy: {
        type: String
    },
    privacyPolicy: {
        type: String
    },
    refundPolicy: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

module.exports = mongoose.model("Misc", MiscellaneousSchema);
