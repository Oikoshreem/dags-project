const Orders = require('../../models/user/order.model');
exports.viewOrders = async (req, res) => {
    try {
        let orders;
        if (req.body.filter == true) {
            orders = await Orders.find({ OrderStatus: { $ne: "Completed" } });
        } else {
            orders = await Orders.find();
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

        const order = await Orders.find({ orderId })
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
        const updatedOrder = await Orders.findOneAndUpdate(
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
        const orders = await Orders.find({ OrderStatus: { $eq: "Canceled" } });
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