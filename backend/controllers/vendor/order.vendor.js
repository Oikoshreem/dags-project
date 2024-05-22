const Order = require('../../models/user/order.model');
const { startOfDay, endOfDay, isBefore } = require('date-fns');
const Vendor = require('../../models/vendor/vendor.model');
const Service = require('../../models/vendor/service.model');
const Commission = require('../../models/admin/commission')
const Logistic = require('../../models/logistic/delivery.model')

exports.getVendorDashboard = async (req, res) => {
    const vendorId = req.body.vendorId;
    const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
    const per = await Commission.find();

    try {
        const todayOrders = await Order.find({
            vendorId: vendorId,
            'orderStatus': {
                $elemMatch: {
                    status: 'Initiated',
                    time: {
                        $gte: startOfDay(today),
                        $lte: endOfDay(today)
                    }
                }
            }
        });

        let totalAmountToday = 0;
        todayOrders.forEach(order => {
            totalAmountToday += parseFloat(order.vendorFee);
        });

        const completedOrders = await Order.find({
            vendorId: vendorId,
            'orderStatus': {
                $elemMatch: {
                    status: 'readyForDelivery',
                    time: {
                        $gte: startOfDay(today),
                        $lte: endOfDay(today)
                    }
                }
            }
        });

        const totalCompletedOrders = completedOrders.length;

        const previousDaysOrders = await Order.find({
            vendorId: vendorId,
            'orderDate': {
                $lt: startOfDay(today)
            },
            'orderStatus.status': {
                $nin: ['complete', 'cancelled']
            }
        });

        res.status(200).json({
            totalAmountToday,
            totalCompletedOrders,
            todayOrders,
            previousDaysOrders
        });
    } catch (error) {
        console.error("Error retrieving vendor dashboard data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getTodaysOrder = async (req, res) => {
    const { vendorId } = req.body;
    try {
        const allOrders = await Order.find({
            vendorId: vendorId,
            $or: [
                {
                    'orderStatus': {
                        $elemMatch: {
                            status: 'Initiated',
                            time: {
                                $gte: startOfDay(today),
                                $lte: endOfDay(today)
                            }
                        }
                    }
                },
                {
                    'orderDate': {
                        $lt: startOfDay(today)
                    },
                    'orderStatus.status': {
                        $nin: ['complete', 'cancelled']
                    }
                }
            ]
        });
        res.status(200).json({
            allOrders
        })

    } catch (error) {
        console.error("Error retrieving todays data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.fetchAllOrder = async (req, res) => {
    const { vendorId } = req.body;
    const orders = await Order.find({ vendorId })
    res.json({
        message: "All Orders for vendor fetched successfully",
        orders
    })
}

exports.getOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.find({ orderId })

        if (!order) {
            throw new Error('Order not found');
        }

        const populatedItems = [];

        for (const item of order.items) {
            const service = await Service.findOne({ serviceId: item.serviceId });

            const foundItem = service.items.find(servItem => servItem.itemId === item.itemId);

            // if (!foundItem) {
            //     continue;
            // }

            populatedItems.push({
                itemName: foundItem.name,
                service: service.name,
                unitPrice: item.unitPrice,
                qty: item.qty
            });
        }

        return res.status(200).json({
            mesage: "order fetched sucessfully",
            ordersDetails: populatedItems, order
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to find order",
            error: error.message,
        });
    }
}

exports.acceptOrder = async (req, res) => {
    try {
        const { orderId, secretKey } = req.body;
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.secretKey !== secretKey) {
            return res.status(403).json({ error: "Invalid secret key" });
        }

        //marking his active order as -1
        const logisticId = order.logisticId[0];
        const logistic = await Logistic.findOne({logisticId})
        logistic.currentActiveOrder -= 1
        await logistic.save();


        order.orderStatus.push({
            status: "cleaning",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });

        await order.save();

        res.status(200).json({ order });
    } catch (error) {
        {
            console.error("Error updating order status:", error);
            res.status(500).json({ error: "Failed to update order status" });
        }
    }
};

exports.readyForDelivery = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findOne({orderId});

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const vendor = await Vendor.findOne({ vendorId: order.vendorId });

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        vendor.currrentActiveOrders -= 1;
        await vendor.save();

        order.orderStatus.push({
            status: "readyForDelivery",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });
        await order.save();

        return res.json({
            message: "Order is ready to be picked up by delivery service",
            order
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error", message: error.message });
    }
}

exports.activeOrders = async (req, res) => {
    try {
        const { vendorId } = req.body;
        const orders = await Order.find({ vendorId });

        const activeOrders = orders.filter(order => !order.orderStatus.some(status => status.status === 'cancelled'));
        const filteredOrders = activeOrders.filter(order => order.orderStatus.length < 4);

        res.json({
            message: "Active orders fetched successfully",
            orders: filteredOrders
        });
    } catch (error) {
        console.error('Error fetching active orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
