const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
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
    paymentTo: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.model("Payment", PaymentSchema);
