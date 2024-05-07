const Order = require('../../models/user/order.model');
const User = require('../../models/user/user.model');
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

        const order = await Order.find({ orderId })
        return res.status(200).json({
            mesage: "order fetched sucessfully",
            order
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to find order",
            error: error.message,
        });
    }
}

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
        const { userid, ...updates } = req.body;
        const user = await User.findOne({ phone: userid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        const order = await Order.create({
            userId: userid,
            orderDate: currentTime,
            updates
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

exports.day = async (req, res) => {
    try {
        const date = new Date();
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);

        const totalOrders = await Orders.countDocuments({
            orderDate: { $gte: date, $lt: nextDay }
        }).sort({ orderDate: 1 });

        res.json({ totalOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.week = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const totalOrders = await Order.countDocuments({
            orderDate: { $gte: startOfWeek, $lt: endOfWeek }
        }).sort({ orderDate: 1 });

        res.json({ totalOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.month = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const totalOrders = await Order.countDocuments({
            orderDate: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ orderDate: 1 });

        res.json({ totalOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.dateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const totalOrders = await Order.countDocuments({
            orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).sort({ orderDate: 1 });

        res.json({ totalOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}