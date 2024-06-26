const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    orderDate: {
        type: Date,
        default: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString() //time on which order is placed 
    },
    orderStatus: [{
        status: {
            type: String,
            default: "pending" //0-pending , 1-initiated, 2-readyToPickup, 3-pickedUp, 4-cleaning, 
            //5-readyToDelivery, 6-outForDelivery, 7-delivered, 8-cancelled, 9-refunded
        },
        time: {
            type: Date,
            default: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        }
    }],
    amount: {
        type: Number  //amout exclusive of tax
    },
    settlementToVendor: {
        type: Number,
        deafult: null
    },
    settlementForLogisticsOnPickup: {
        type: Number,
        deafult: null
    },
    settlementForLogisticsOnDelivery: {
        type: Number,
        deafult: null
    },
    discount: {
        type: String
    },
    deliveryFee: { //amount that is charged by vendor for this order
        type: Number
    },
    vendorFee: {
        type: Number
    },
    taxes: {
        type: Number
    },
    paymentMode: {
        type: String
    },
    transactionId: {
        type: String
    },
    paymentId: {
        type: String
    },
    paymentSignature: {
        type: String
    },
    userId: {
        type: String
    },
    vendorId: {
        type: String
    },
    pickupDate: {
        type: Date  //the date on whioch user selects 
    },
    deliveryDate: {
        type: Date
    },
    razorpayKey: {
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
            let newOrderId = 'OD0000001'; // Starting with OD00001

            if (highestOrder) {
                const lastOrderIdNumber = parseInt(highestOrder.orderId.replace(/[^\d]/g, ''), 10);
                newOrderId = `OD${String(lastOrderIdNumber + 1).padStart(5, '0')}`;
            }

            this.orderId = newOrderId;
        }
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model("Order", OrderSchema);