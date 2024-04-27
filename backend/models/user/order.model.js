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
        type: String
    },
    discount: {
        type: String
    },
    paymentMode: {
        type: String
    },
    transactionId: {
        type: String
    },
    userId: {
        type: String
    },
    vendorId: {
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
        itemId: {
            type: String
        },
        serviceId: {
            type: Date 
        },
        unitPrice: {
            type: String
        },
        qty: {
            type: Date 
        }
    }],
    order_pics: [{
        type: String
    }],
    notes: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.model("Order", OrderSchema);
