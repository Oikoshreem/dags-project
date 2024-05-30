const Order = require("../../models/user/order.model");
const Settlement = require("../../models/admin/settlement.model");
const Vendor = require("../../models/vendor/vendor.model");

exports.vendorSettlement = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $match: {
                    $and: [
                        { settlementToVendor: { $ne: 0 } },
                        { settlementToVendor: { $ne: null } }
                    ]
                }
            },
            {
                $group: {
                    _id: "$vendorId",
                    totalSettlement: { $sum: "$settlementToVendor" },
                    orders: { $push: "$$ROOT" }
                }
            },
            // {
            //     $project: {
            //         vendorId: "$_id",
            //         totalSettlement: 1,
            //         orders: 1,
            //     }
            // }
        ]);

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the orders' });
    }
}

exports.settleVendorAmount = async (req, res) => {
    try {
        const { vendor } = req.body;

        // if (!vendor || !vendor._id || !vendor.orders) {
        //     return res.status(400).json({ error: 'Invalid vendor data' });
        // }

        const { _id, orders, totalSettlement } = req.body;
        const orderIds = orders.map(order => order._id);

        const updateResult = await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: { settlementToVendor: 0 } }
        );

        const history = await Settlement.create({
            amount: totalSettlement,
            Id: _id,
            date: new Date(Date.now() + 5.5 * 60 * 60 * 1000)
                .toISOString(),
            orderIds: orderIds,
        })

        res.status(200).json({
            message: 'Vendor settlements updated successfully',
            vendorId: _id,
            totalSettlement: totalSettlement,
            settledOrders: orderIds
        });
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while settling vendor amounts',
            message: error.message
        });
    }
};

exports.viewHistory = async (req, res) => {
    try {
        const settlementHistory = await Settlement.find({});
        let settledOrders = [];

        if (!settlementHistory.length) {
            return res.status(404).json({ error: 'No settlement history found' });
        }

        for (const settlement of settlementHistory) {
            const orders = await Order.find({ _id: { $in: settlement.orderIds } });
            settledOrders.push(orders);
        }

        res.status(200).json({
            message: 'Settlement history fetched successfully',
            history: settlementHistory,
            orders: settledOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while fetching settlement history',
            message: error.message
        });
    }
};

exports.logisticPickupSettlement = async (req, res) => {
    try {
        const pickupSettlements = await Order.aggregate([
            {
                $match: {
                    "logisticId.0": { $exists: true, $ne: null },
                    settlementForLogisticsOnPickup: { $ne: 0, $ne: null }
                }
            },
            {
                $group: {
                    _id: "$logisticId.0",
                    totalPickupSettlement: { $sum: "$settlementForLogisticsOnPickup" },
                    orders: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    logisticId: "$_id",
                    totalPickupSettlement: 1,
                    orders: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json(pickupSettlements);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the pickup logistic settlements' });
    }
};

exports.logisticDeliverySettlement = async (req, res) => {
    try {
        const deliverySettlements = await Order.aggregate([
            {
                $match: {
                    "logisticId.1": { $exists: true, $ne: null },
                    settlementForLogisticsOnDelivery: { $ne: 0, $ne: null }
                }
            },
            {
                $group: {
                    _id: "$logisticId.1",
                    totalDeliverySettlement: { $sum: "$settlementForLogisticsOnDelivery" },
                    orders: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    logisticId: "$_id",
                    totalDeliverySettlement: 1,
                    orders: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json(deliverySettlements);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the delivery logistic settlements' });
    }
};


exports.getValidLogisticIds = async (req, res) => {
    try {
        const validLogisticIds = await Order.aggregate([
            {
                $match: {
                    $or: [
                        { "logisticId.0": { $exists: true, $ne: null }, settlementForLogisticsOnPickup: { $ne: 0, $ne: null } },
                        { "logisticId.1": { $exists: true, $ne: null }, settlementForLogisticsOnDelivery: { $ne: 0, $ne: null } }
                    ]
                }
            },
            {
                $project: {
                    pickupLogisticId: { $arrayElemAt: ["$logisticId", 0] },
                    deliveryLogisticId: { $arrayElemAt: ["$logisticId", 1] }
                }
            },
            {
                $group: {
                    _id: null,
                    logisticIds: {
                        $addToSet: { $cond: [{ $ne: ["$pickupLogisticId", null] }, "$pickupLogisticId", "$$REMOVE"] }
                    }
                }
            },
            {
                $project: {
                    logisticIds: {
                        $concatArrays: [
                            "$logisticIds",
                            {
                                $filter: {
                                    input: "$logisticIds",
                                    as: "logisticId",
                                    cond: { $ne: ["$$logisticId", null] }
                                }
                            }
                        ]
                    }
                }
            }
        ]);

        const logisticIds = validLogisticIds.length ? validLogisticIds[0].logisticIds : [];
        res.status(200).json({ logisticIds });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching valid logistic IDs' });
    }
};


