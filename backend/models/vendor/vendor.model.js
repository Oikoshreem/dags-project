const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String
    },
    profilePic: {
        type: String
    },
    docType: {
        type: String
    },
    document: {
        type: String
    },
    verificationStatus: {
        type: String,
        default: 'pending'
    },
    OTP: {
        type: String
    },
    capacity: {
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
    }
}, { versionKey: false });

module.exports = mongoose.model("Vendor", VendorSchema);
