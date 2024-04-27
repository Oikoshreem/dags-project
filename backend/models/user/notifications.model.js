const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    Id: {
        type: String
    },
    channel: {
        type: Number
    },
    title: {
        type: String,
    },
    subtitle: {
        type: String
    },
    action: {
        type: String
    },
    notificationFor: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.model("Payment", PaymentSchema);
