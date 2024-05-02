const Order = require('../../models/user/order.model');
const moment = require('moment');
const Vendor = require('../../models/vendor/vendor.model');

exports.getVendorDashboard = async (req, res) => {
    const vendorId = req.params.vendorId;

    try {
        const todayOrders = await Order.find({
            vendorId: vendorId,
            'orderDate': {
                $gte: moment().startOf('day').toISOString(),
                $lte: moment().endOf('day').toISOString()
            },
            'orderStatus.0.status': 'Initiated', // Ensure first status is 'Initiated'
        });

        // Calculate total amount generated from today's orders
        let totalAmountToday = 0;
        todayOrders.forEach(order => {
            totalAmountToday += parseFloat(order.amount);
        });

        // Fetch completed orders for the vendor
        const completedOrders = await Order.find({
            vendorId: vendorId,
            'orderStatus.0.status': 'Initiated', // Ensure first status is 'Initiated'
            'orderStatus': { $elemMatch: { status: 'complete' } } // Ensure at least one 'complete' status
        });

        const totalCompletedOrders = completedOrders.length;

        const previousDaysOrders = await Order.find({
            vendorId: vendorId,
            'orderDate': {
                $lt: moment().startOf('day').toISOString()
            },
            'orderStatus.status': { $ne: 'complete' }, 
            'orderStatus.status': { $not: { $elemMatch: { status: 'cancelled' } } } 
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