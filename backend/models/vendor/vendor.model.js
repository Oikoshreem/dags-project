const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    profile_pic: {
        type: String
    },
    docType: {
        type: String
    },
    document: {
        type: String
    },
    verificationStatus: {
        type: String
    },
    OTP: {
        type: String
    },
    Capacity: {
        type: Number
    },
    availability: {
        type: Boolean
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    status: {
        type: String
    },
    orders: [{
        type: String
    }],
    lastLogin: {
        type: Date
    },
    ip: [{
        type: String
    }],
    createdOn: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

module.exports = mongoose.model("Vendor", VendorSchema);
