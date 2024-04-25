const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    orderDate: {
        type: Date,
    },
    orderStatus: {
        status: {
            type: String
        },
        time: {
            type: Date 
        }
    },
    amount: {
        type: Number
    },
    discount: {
        type: Number
    },
    paymentMode: {
        type: String
    },
    transactionID: {
        type: String
    },
    userId: {
        type: String
    },
    vendorIdendorId: {
        type: String
    },
    pickupDate: {
        type: Date
    },
    deliveryDate: {
        type: Date
    },
    deliveryType: {
        type: String
    },
    logisticId: {
        type: String
    },
    secretKey: {
        type: String
    },
    orderLocation: {
        type: String
    },
    items: [{
        type: String
    }],
    order_pics: [{
        type: String
    }],
    notes: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.model("Order", OrderSchema);
