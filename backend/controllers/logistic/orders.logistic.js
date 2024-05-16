const Order = require('../../models/user/order.model');
const { startOfDay, endOfDay, isBefore, subDays } = require('date-fns');
const Vendor = require('../../models/vendor/vendor.model');
const Service = require('../../models/vendor/service.model');
const Logistic = require('../../models/logistic/delivery.model');
const User = require('../../models/user/user.model');
const { generateOTP } = require('../../utils/admin/generateOTP');

exports.getLogisticDashboard = async (req, res) => {
    const logisticId = req.body.logisticId;
    const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString();
    const yesterday = subDays(new Date(), 1); // Calculate yesterday's date

    try {
        const todayOrders = await Order.find({
            logisticId: logisticId,
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

        // Initialize variables to track total amounts and income for today
        let totalAmountToday = 0;
        let totalIncomeToday = 0;

        // Fetch today's completed orders
        const completedOrdersToday = await Order.find({
            logisticId: logisticId,
            'orderStatus': {
                $elemMatch: {
                    status: 'complete',
                    time: {
                        $gte: startOfDay(today),
                        $lte: endOfDay(today)
                    }
                }
            }
        });

        completedOrdersToday.forEach(order => {
            order.amount.forEach(amount => {
                totalIncomeToday += amount;
            });
        });

        // Fetch previous day's completed orders with status 'completed'
        const completedOrdersYesterday = await Order.find({
            logisticId: logisticId,
            'orderDate': {
                $gte: startOfDay(yesterday),
                $lt: startOfDay(today)
            },
            'orderStatus.status': 'complete'
        });

        // Iterate over previous day's completed orders to calculate total income for today
        completedOrdersYesterday.forEach(order => {
            order.amount.forEach(amount => {
                totalIncomeToday += amount;
            });
        });

        // Calculate total amount for today's orders
        todayOrders.forEach(order => {
            order.amount.forEach(amount => {
                totalAmountToday += amount;
            });
        });

        // Calculate total completed orders for today
        const totalCompletedOrders = completedOrdersToday.length + completedOrdersYesterday.length;

        // Fetch previous day's orders with status other than 'complete' or 'cancelled'
        const previousDaysOrders = await Order.find({
            logisticId: logisticId,
            'orderDate': {
                $lt: startOfDay(today)
            },
            'orderStatus.status': {
                $nin: ['complete', 'cancelled']
            }
        });

        // Send response with the calculated data
        res.status(200).json({
            totalAmountToday,
            totalCompletedOrders,
            totalIncomeToday,
            todayOrders,
            previousDaysOrders
        });
    } catch (error) {
        console.error("Error retrieving logistic dashboard data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getAllOrders = async (req, res) => {
    const { logisticId } = req.body;
    try {
        const logistic = await Logistic.find(logisticId);
        const orderIds = logistic.orders
        const orders = await Order.find({ orderId: { $in: orderIds } });
        res.json(orders)
    } catch (error) {
        console.error("Error retrieving orders data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.fetchActiveOrders = async (req, res) => {
    try {
        const { logisticId } = req.body;
        const logistic = await Logistic.find(logisticId);
        const orderIds = logistic.orders
        const orders = await Order.find({ orderId: { $in: orderIds } });//will get all orders even repeated orders 

        const activeOrders = orders.filter(order => {
            const orderStatusLength = order.orderStatus.length;
            return orderStatusLength === 4 || orderStatusLength === 7;
        });  //if index is 7 then if the same logisticid is present in 4 then that order isd already done at 4 and not consider as active

        return res.status(200).json({ activeOrders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
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
            populatedItems, order
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to find order",
            error: error.message,
        });
    }
}

exports.pickedUpStatus = async (req, res) => {
    try {
        const { orderId, secretKey } = req.body;
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        order.secretKey = secretKey;

        order.orderStatus.push({
            status: "pickedUp",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });

        // const logisticId = order.logisticId[0]
        // const logistic = await Logistic.findOne({ logisticId })

        await order.save();
        // await logistic.save();

        res.status(200).json({
            message: "Order updated successfully",
            order
        });
    } catch (error) {
        {
            console.error("Error updating order status:", error);
            res.status(500).json({ error: "Failed to update order status" });
        }
    }
};

exports.outOfDeliveryStatus = async (req, res) => {
    try {
        const { orderId, secretKey } = req.body;
        const order = await Order.findOne({ orderId });
        const user = await User.findOne(order.userId)

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.secretKey !== secretKey) {
            return res.status(403).json({ error: "Invalid secret key" });
        }

        order.orderStatus.push({
            status: "outOfDelivery",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });

        const phoneOTP = generateOTP();
        const hashedOTP = await bcrypt.hash(phoneOTP, 10);
        user.OTP = hashedOTP;
        sendOTP(phoneOTP, user.phone);

        const logisticId = order.logisticId[1]
        const logistic = await Logistic.findOne({ logisticId })
        logistic.currentActiveOrder += 1;


        await order.save();
        await user.save();
        await logistic.save();

        res.status(200).json({
            message: "Order delivered successfully",
            order
        });
    } catch (error) {
        {
            console.error("Error updating order status:", error);
            res.status(500).json({ error: "Failed to update order status" });
        }
    }
};

exports.confirmDelivery = async (req, res) => {
    try {
        const { otp, orderId } = req.body;
        const order = await Order.findOne(orderId)
        const user = await User.findOne({ phone: order.userId });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const otpMatch = await bcrypt.compare(otp, user.OTP);
        if (!otpMatch) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }
        order.orderStatus.push({
            status: "delivered",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });
        await order.save();

        return res.json({
            message: "Order is Delivered Successfully",
            order
        })
    } catch { }
}
