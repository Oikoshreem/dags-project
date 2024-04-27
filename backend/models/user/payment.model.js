const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    paymentMethod: {
        type: String
    },
    amount: {
        type: Number
    },
    orderId: {
        type: String,
    },
    transactionId: {
        type: String
    },
    paymentFrom: {
        type: String
    },
    paymentTo: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.model("Payment", PaymentSchema);
