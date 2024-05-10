const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    orderDate: {
        type: Date,
    },
    orderStatus: [{
        status: {
            type: String,
            default: "pending" //pending , initiated, readyToPickup, pickedUp, cleaning, readyToDelivery, outForDelivery, delivered, cancelled, refunded
        },
        time: {
            type: Date,
            default: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        }
    }],
    amount: {
        type: Number  //amout exclusive of tax
    },
    discount: {
        type: String
    },
    deliveryFee: {
        pickup: { type: Number },
        drop: { type: Number }  //amount that is charged by vendor for this order
    },
    vendorFee: {
        type: String
    },
    taxes: {
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
    logisticId: [{
        type: String
    }],
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
            type: String
        },
        unitPrice: {
            type: Number
        },
        qty: {
            type: Number
        }
    }],
    order_pics: [{
        type: String
    }],
    notes: {
        type: String
    }
}, { versionKey: false });

OrderSchema.pre('save', async function (next) {
    try {
        if (!this.orderId) {
            const highestOrder = await mongoose.model('Order').findOne({}, { orderId: 1 }, { sort: { 'orderId': -1 } });
            let newOrderId = 'OD1';

            if (highestOrder) {
                const lastOrderIdNumber = parseInt(highestOrder.orderId.replace(/[^\d]/g, ''), 10);
                newOrderId = `OD${lastOrderIdNumber + 1}`;
            }

            this.orderId = newOrderId;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Order", OrderSchema);