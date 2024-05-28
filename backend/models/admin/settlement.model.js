const mongoose = require("mongoose");

const SettlementSchema = new mongoose.Schema({
    orderId: {
        type: String
    },
    amount: {
        type: String
    },
    status: {
        type: String
    },
    amountFor: {
        type: String  //for vendor or logistic
    },
    date: {
        type: Date
    }
}, { versionKey: false });

module.exports = mongoose.model("Settlement", SettlementSchema);
