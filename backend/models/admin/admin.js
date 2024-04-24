const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        require: true,
        trim: true
    },
    passcode: {
        type: String,
    },
    password:{
        type:String
    },
    ip: [{
        type: String,
    }],
    last_login: {
        type: String,
    }
}, { versionKey: false });

module.exports = mongoose.model("Admin", AdminSchema);