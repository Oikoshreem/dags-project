const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema({
    accountHolderName: {
        type: String,
        require: true
    },
    bankName: {
        type: String,
        require: true
    },
    accountNumber: {
        type: String,
        require: true
    },
    IFSC: {
        type: String,
        require: true
    },
    branch: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
}, { versionKey: false });

module.exports = mongoose.model("BankDetails", BankDetailsSchema);
