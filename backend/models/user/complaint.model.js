const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    ticketId: {
        type: String
    },
    issue: {
        type: Number
    },
    picture: {
        type: String,
    },
    solution: [{
        time: { type: String, },
        user: { type: String, },
        message: { type: String, }
    }],
    rating: {
        type: String
    },
}, { versionKey: false });

module.exports = mongoose.model("Complaint", ComplaintSchema);
