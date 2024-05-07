const mongoose = require("mongoose");

const Commission = new mongoose.Schema({
    percentage: {
        type: Number,
        default:30
    }
}, { versionKey: false });

module.exports = mongoose.model("Tax", Commission);