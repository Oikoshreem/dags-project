const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    serviceId: {
        type: String,
        unique: true
    },
    serviceName: {
        type: String
    },
    items: [{
        itemId: {
            type: String
        },
        name: {
            type: Date
        },
        unitPrice: {
            type: String
        }
    }]
}, { versionKey: false });

module.exports = mongoose.model("Service", ServiceSchema);
