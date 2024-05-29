const mongoose = require("mongoose");

const SettlementSchema = new mongoose.Schema({
    Id: {
        type: String
    },
    amount: {
        type: Number
    },
    status: {
        type: String
    },
    amountFor: {
        type: String  //for vendor or logistic
    },
    totalOrders: {
        type: Number
    },
    orderIds: [{
        type: String
    }],
    date: {
        type: Date
    }
}, { versionKey: false });

module.exports = mongoose.model("Settlement", SettlementSchema);
