const mongoose = require("mongoose");

const DeliveryPartnerSchema = new mongoose.Schema({
    partnerId: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    profile_pic: {
        type: String
    },
    OTP: {
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
    capacity: {
        type: Number
    },
    availability: {
        type: Boolean
    },
    geoCoordinates: {
        type: String
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
        type: String,
    }],
    lastLogin: {
        type: Date
    },
    ip: [{
        type: String
    }],
    createdOn: {
        type: Date
    }
}, { versionKey: false });

module.exports = mongoose.model("DeliveryPartner", DeliveryPartnerSchema);