const Order = require('../../models/user/order.model');
const User = require('../../models/user/user.model');
const Vendor = require('../../models/vendor/vendor.model');
const Logistic = require('../../models/logistic/delivery.model');

exports.viewOrders = async (req, res) => {
    try {
        let orders;
        if (req.body.filter == true) {
            orders = await Order.find({ OrderStatus: { $ne: "Completed" } });
        } else {
            orders = await Order.find();
        }
        return res.status(200).json({
            orders,
            message: "Orders fetched successfully"
        })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to find orders",
                error: error.message,
            });
    }
}

exports.getOrder = async (req, res) => {
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

        const user = await User.findOne({ phone: order.userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const vendor = await Vendor.findOne({ vendorId: order.vendorId });

        const logisticDetails = await Logistic.find({
            logisticId: { $in: order.logisticId }
        });
        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order: {
                ...order.toObject(),
                user: user,
                vendor: vendor,
                logisticDetails: logisticDetails.map(logistic => logistic.toObject())
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to find order",
            error: error.message,
        });
    }
};

exports.updateOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            req.body,
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            message: "Order Updated successfully",
            updatedOrder
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getCancelledOrders = async (req, res) => {
    try {
        const orders = await Order.find({ OrderStatus: { $eq: "Canceled" } });
        res.status(200).json({
            message: "Cancelled orders fetched successfully",
            orders
        });
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong while fetching cancelled orders",
            error: error.message
        });
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { phone, ...updates } = req.body;
        const user = await User.findOne({ phone: phone });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        updates.orderStatus = [{
            status: "pending",
            time: currentTime
        }];

        const order = await Order.create({
            userId: phone,
            orderDate: currentTime,
            ...updates,
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message,
        });
    }
};

exports.fetchOrdersByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        if (start > end) {
            return res.status(400).json({ message: "End date must be after start date" });
        }

        const orders = await Order.find({
            "orderStatus.0.time": { $gte: start, $lte: end }
        });

        const userPhones = [...new Set(orders.map(order => order.userId))];
        const vendorIds = [...new Set(orders.map(order => order.vendorId))];

        const users = await User.find({ phone: { $in: userPhones } });
        const vendors = await Vendor.find({ vendorId: { $in: vendorIds } });

        const userMap = users.reduce((acc, user) => {
            acc[user.phone] = user;
            return acc;
        }, {});

        const vendorMap = vendors.reduce((acc, vendor) => {
            acc[vendor.vendorId] = vendor;
            return acc;
        }, {});

        const populatedOrders = orders.map(order => ({
            ...order.toObject(),
            user: userMap[order.userId],
            vendor: vendorMap[order.vendorId],
        }));

        res.status(200).json({ message: "Orders fetched successfully", orders: populatedOrders });
    } catch (error) {
        console.error(`Error fetching orders by date range: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
};


// exports.day = async (req, res) => {
//     try {
//         const date = new Date();
//         const nextDay = new Date(date);
//         nextDay.setDate(date.getDate() + 1);

//         const totalOrders = await Orders.countDocuments({
//             orderDate: { $gte: date, $lt: nextDay }
//         }).sort({ orderDate: 1 });
 
//         res.json({ totalOrders });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// exports.week = async (req, res) => {
//     try {
//         const today = new Date();
//         const startOfWeek = new Date(today);
//         startOfWeek.setDate(today.getDate() - today.getDay());
//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 7);

//         const totalOrders = await Order.countDocuments({
//             orderDate: { $gte: startOfWeek, $lt: endOfWeek }
//         }).sort({ orderDate: 1 });

//         res.json({ totalOrders });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// exports.month = async (req, res) => {
//     try {
//         const today = new Date();
//         const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//         const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//         const totalOrders = await Order.countDocuments({
//             orderDate: { $gte: startOfMonth, $lte: endOfMonth }
//         }).sort({ orderDate: 1 });

//         res.json({ totalOrders });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// exports.dateRange = async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;

//         const totalOrders = await Order.countDocuments({
//             orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
//         }).sort({ orderDate: 1 });

//         res.json({ totalOrders });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }