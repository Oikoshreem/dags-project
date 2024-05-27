const Order = require("../../models/user/order.model");
const User = require("../../models/user/user.model");
const Service = require("../../models/vendor/service.model");
const Commission = require("../../models/admin/commission");
const Vendor = require("../../models/vendor/vendor.model");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_SECRET_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

exports.fetchServices = async (req, res) => {
    try {
        const service = await Service.find();
        res.json({ message: "Service fetched successfully", service });
    } catch (error) {
        res.status(500).json({
            error: "Could not find service",
            message: error.message,
        });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { orders, vendorId, deliveryFee, phone, orderPics, ...updates } = req.body;
        const orderItems = [];
        let allAmount = 0;
        let allCommission = 0;

        const user = await User.findOne({ phone });
        if(!user){
            return res
                    .status(404)
                    .json({ message: `User with phone number ${phone} not found` });
        }

        for (const order of orders) {
            const { itemId, qty, serviceId } = order;
            const service = await Service.findOne({ serviceId: serviceId });
            if (!service) {
                return res
                    .status(404)
                    .json({ message: `Service with ID ${serviceId} not found` });
            }
            // let unitPrice = 0;
            // let commission = 0;
            const item = service.items.find(item => item.itemId === itemId);
            console.log(item)
            const unitPrice = item.unitPrice;
            const commission = (unitPrice * qty * service.vendorCommission) / 100;
            const Amount = unitPrice * qty;
            allAmount += Amount;
            allCommission += commission;

            orderItems.push({
                itemId,
                qty,
                serviceId,
                unitPrice,
            });
        }

        //pics data gettign stored
        // const orderPicsUrls = [];
        // if (orderPics.length) {
        //     const orderPicsDir = path.join(process.env.FILE_SAVE_PATH, 'orders');

        //     if (!fs.existsSync(orderPicsDir)) {
        //         fs.mkdirSync(orderPicsDir, { recursive: true });
        //     }

        //     for (const pic of orderPics) {
        //         const picBuffer = Buffer.from(pic, 'binary');
        //         const picFilename = `${uuidv4()}.jpg`; // for unique name for each pic gettting stored
        //         const picPath = path.join(orderPicsDir, picFilename);

        //         fs.writeFileSync(picPath, picBuffer);
        //         // const picUrl = `/uploads/orders/${picFilename}`; // Adjust this based on your static files serving setup
        //         orderPicsUrls.push(picPath);
        //     }
        // }

        const orderPicsUrls = await saveOrderPics(orderPics);
        console.log(orderItems)
        const newOrder = new Order(
            Object.assign(
                {
                    items: orderItems,
                    userId: phone,
                    amount: allAmount,
                    deliveryFee: deliveryFee * 2,
                    vendorId: vendorId,
                    vendorFee: allCommission,
                    ordersPic: orderPicsUrls,
                    orderStatus: [{ status: "pending" }], // Set initial status as "pending"
                    orderTime: new Date(
                        Date.now() + 5.5 * 60 * 60 * 1000
                    ).toISOString(),
                },
                updates
            )
        );
        await newOrder.save();

        const orderId = newOrder.orderId; //to push newly created order into user data
        user.orders.push(orderId);
        await user.save();
        console.log(razorpay.orders.create)
        const razorpayOrder = await razorpay.orders.create({
            amount: allAmount * 100,
            currency: 'INR',
            receipt: orderId.toString(),
            payment_capture: '1'
        });

        res.status(201).json({
            message: "Order created successfully",
            order: newOrder,
            razorpayOrder: razorpayOrder
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error rip",
            error: error.message,
            e: razorpay
        });
    }
};

async function saveOrderPics(orderPics) {
    if (!Array.isArray(orderPics) || orderPics.length === 0) {
        return [];
    }

    const orderPicsUrls = [];
    const orderPicsDir = path.join(process.env.FILE_SAVE_PATH, 'orders');

    if (!fs.existsSync(orderPicsDir)) {
        fs.mkdirSync(orderPicsDir, { recursive: true });
    }

    for (const pic of orderPics) {
        const picBuffer = Buffer.from(pic, 'binary');
        const picFilename = `${uuidv4()}.jpg`;
        const picPath = path.join(orderPicsDir, picFilename);

        fs.writeFileSync(picPath, picBuffer);
        orderPicsUrls.push(picPath);
    }

    return orderPicsUrls;
}

exports.verifyPayment = async (req, res) => {
    const { orderId, paymentId, paymentSignature } = req.body
    try {
        const payment = await razorpay.payments.fetch(paymentId);
        const isSignatureValid = verifySignature(paymentSignature, payment);

        if (!isSignatureValid) {
            res.json({ message: "Invalid payment signature" });
        }

        if (payment.status === "captured") {
            await Order.findOneAndUpdate(
                { orderId },
                { $push: { orderStatus: { status: "initiated" } } }
            );
            console.log(
                `Order with ID ${orderId} payment verified and status updated to initiated.`
            );
        } else {
            res.json({
                message: `Payment status is not captured. Status: ${payment.status}`,
            });
        }
    } catch (error) {
        console.error(
            `Error verifying payment for order with ID ${orderId}: ${error.message}`
        );
        throw error;
    }
};

const verifySignature = (paymentSignature, payment) => {
    const { orderId, razorpay_payment_id } = payment;
    const secret = process.env.RAZORPAY_SECRET_KEY;
    const generatedSignature = crypto.createHmac('sha256', secret)
        .update(orderId + "|" + razorpay_payment_id)
        .digest('hex');
    return generatedSignature === paymentSignature;
};

exports.fetchAllOrders = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne(phone);
        const orders = await Order.find({ userId: phone })
        const activeOrders = orders.filter(order =>
            order.orderStatus[order.orderStatus.length - 1].status !== "delivered" &&
            order.orderStatus[order.orderStatus.length - 1].status !== "cancelled" &&
            order.orderStatus[order.orderStatus.length - 1].status !== "refunded"
        );

        const pastOrders = orders.filter(order =>
            order.orderStatus[order.orderStatus.length - 1].status === "delivered" ||
            order.orderStatus[order.orderStatus.length - 1].status === "cancelled" ||
            order.orderStatus[order.orderStatus.length - 1].status === "refunded" ||
            order.orderStatus[order.orderStatus.length - 1].status === "pending"
        );

        res.status(200).json({ activeOrders, pastOrders });
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
};

exports.viewOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order: order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to find order",
            error: error.message,
        });
    }
};

exports.viewItem = async (req, res) => {
    try {
        const { orderId, serviceId, itemId } = req.body;

        if (!serviceId || !itemId) {
            return res.status(400).json({
                success: false,
                message: "Service ID and Item ID are required"
            });
        }

        const service = await Service.findOne({ serviceId });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        const item = service.items.find(item => item.itemId === itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found within the service"
            });
        }

        const response = {
            item,
            service: {
                serviceId: service.serviceId,
                serviceName: service.serviceName
            }
        };

        return res.status(200).json({
            success: true,
            message: "Item and service fetched successfully",
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch item and service",
            error: error.message,
        });
    }
};

// exports.createOrder = async (req, res) => {
//     const { orders, vendorId, ...updates } = req.body;

//     const orderItems = [];
//     let totalAmount = 0;

//     for (const order of orders) {
//         const { itemId, qty, serviceId } = order;

//         const service = await Service.findOne({ serviceId });
//         if (!service) {
//             return res.status(404).json({ message: `Service with ID ${serviceId} not found` });
//         }

//         const amount = service.items.reduce((acc, item) => {
//             if (item.itemId === itemId) {
//                 return acc + (item.unitPrice * qty);
//             }
//             return acc;
//         }, 0);

//         orderItems.push({
//             itemId,
//             qty,
//             serviceId,
//             unitPrice: service.items.find(item => item.itemId === itemId).unitPrice, // Assuming you need to include unitPrice
//             amount // Changed to lower case to avoid conflict with the array declaration
//         });

//         totalAmount += amount;
//     }

//     const newOrder = new Order(Object.assign({
//         orderStatus: [{ status: "Initiated" }],
//         items: orderItems,
//         amount: totalAmount,
//         vendorId
//     }, updates));

//     await newOrder.save();

//     res.status(201).json({ message: 'Order created successfully', order: newOrder });

// };
