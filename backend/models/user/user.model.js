const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    geoCoordinates: {
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
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
    address:[ {
        type: String
    }],
    pincode: {
        type: String
    },
    status: {
        type: String  //active and inactive 
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