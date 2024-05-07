const mongoose = require("mongoose");

const TaxSchema = new mongoose.Schema({
    percentage: {
        type: Number,
        default:30
    }
}, { versionKey: false });

module.exports = mongoose.model("Tax", TaxSchema);
