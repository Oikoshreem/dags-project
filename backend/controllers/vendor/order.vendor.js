const Order = require('../../models/user/order.model');
const { startOfDay, endOfDay, isBefore } = require('date-fns');
const Vendor = require('../../models/vendor/vendor.model');
const Service = require('../../models/vendor/service.model');

exports.getVendorDashboard = async (req, res) => {
    const vendorId = req.body.vendorId;
    const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()

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
            totalAmountToday += parseFloat(order.amount);
        });

        const completedOrders = await Order.find({
            vendorId: vendorId,
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

exports.getAllOrders = async (req, res) => {
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

    } catch (error) {
        console.error("Error retrieving vendor dashboard data:", error);
        res.status(500).json({ error: "Internal server error" });
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

exports.updateVendor = async (req, res) => {
    const { vendorId } = req.body;
    try {
        const updatedVendor = await Vendor.findOneAndUpdate(
            { vendorId: vendorId },
            req.body,
            { new: true }
        );
        if (!updatedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json({
            message: "Vendor Updated successfully",
            updatedVendor
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
