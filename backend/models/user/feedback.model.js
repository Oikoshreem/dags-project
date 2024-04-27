const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    feedback: {
        type: String
    },
    orderId: {
        type: String
    },
    rating: {
        type: String,
    },
    response: {
        type: String
    },
    userId: {
        type: String
    },
    feedbackFor: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.model("Feedback", FeedbackSchema);
