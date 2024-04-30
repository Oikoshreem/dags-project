const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
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
        type: String,
    },
    profilePic: {
        type: String
    },
    OTP: {
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
        type: String
    }],
    lastLogin: {
        type: String
    },
    ip: [{
        type: String
    }],
    createdOn: {
        type: Date
    }
}, { versionKey: false });

module.exports = mongoose.model("User", UserSchema);