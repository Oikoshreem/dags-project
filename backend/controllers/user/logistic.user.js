const Logistic = require('../../models/logistic/delivery.model');
const Vendor = require('../../models/vendor/vendor.model');
const Order = require('../../models/user/order.model');
const calculateDistance = require('../../utils/logistic/shortestdistance');
const User = require('../../models/user/user.model');
const Misc = require("../../models/logistic/miscellaneous")

exports.ShortestDistanceforUser = async (req, res) => {
    try {
        const { orderId, vendorId } = req.body;  //user coordinates
        const vendor = await Vendor.findOne(vendorId);
        const order = await Order.findOne({ orderId });
        const user = await User.findOne({ phone: order.userId })

        const logistics = await Logistic.find({
            availability: true,
            currentActiveOrders: { $lt: "$capacity" }
        });
        let shortestDistanceL = Infinity;
        let closestlogistic = null;
        logistics.forEach(logistic => {
            const distance = calculateDistance(user.geoCoordinates.latitude, user.geoCoordinates.longitude, logistic.geoCoordinates.latitude, logistic.geoCoordinates.longitude);
            if (distance < shortestDistanceL) {
                shortestDistanceL = distance;
                closestlogistic = logistic;
            }
        });

        vendor.currrentActiveOrders += 1;
        vendor.orders.push(orderId) //array of orders for vendor
        await vendor.save()

        closestlogistic.currrentActiveOrders += 1;
        closestlogistic.orders.push(orderId)
        await closestlogistic.save()

        order.status = "readyToPickup"
        order.logisticId.push(closestlogistic.logisticId)
        order.vendorId = vendor.vendorId
        await order.save()

        res.json({ shortestDistanceL, closestlogistic, vendor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.ShortestDistanceForVendor = async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const vendorId = order.vendorId;
        const vendor = await Vendor.findOne(vendorId);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const logistics = await Logistic.find({
            availability: true,
            currentActiveOrders: { $lt: "$capacity" }
        });

        let shortestDistanceL = Infinity;
        let closestlogistic = null;

        logistics.forEach(logistic => {
            const distance = calculateDistance(vendor.geoCoordinates.latitude, vendor.geoCoordinates.longitude, logistic.geoCoordinates.latitude, logistic.geoCoordinates.longitude);
            if (distance < shortestDistanceL) {
                shortestDistanceL = distance;
                closestlogistic = logistic;
            }
        });

        if (!closestlogistic) {
            return res.status(404).json({ message: "No logistics found" });
        }

        closestlogistic.currentActiveOrders += 1;
        closestlogistic.orders.push(orderId);
        await closestlogistic.save();

        order.logisticId.push(closestlogistic.logisticId)  //pushing logisticid to order's logisticId at 1st index
        await order.save();
        return res.json({ shortestDistanceL, closestlogistic });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.findNearestVendor = async (req, res) => {
    try {
        const { phone } = req.body
        const misc = await Misc.find();

        const user = await User.findOne(phone)
        const vendors = await Vendor.find({
            availability: true,
            currentActiveOrders: { $lt: "$capacity" }
        });

        let shortestDistance = Infinity;
        let closestvendor = null;
        vendors.forEach(vendor => {
            const distance = calculateDistance(user.geoCoordinates.latitude, user.geoCoordinates.longitude, vendor.geoCoordinates.latitude, vendor.geoCoordinates.longitude);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                closestvendor = vendor;
            }
        });

        let deliveryFee = 0;
        if (shortestDistance <= 5) {
            deliveryFee = misc.dist["5"];
        } else if (shortestDistance <= 10) {
            deliveryFee = misc.dist["10"];
        } else if (shortestDistance <= 20) {
            deliveryFee = misc.dist["20"];
        } else {
            deliveryFee = misc.dist["30"]; // For distances above 20+
        }
        res.json({ shortestDistance, closestvendor, deliveryFee });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.ShortestDistanceforUser = async (req, res) => {
    try {
        const { orderId } = req.body;  //user coordinates
        const vendors = await Vendor.find({
            availability: true,
            currentActiveOrders: { $lt: "$capacity" }
        });
        const order = await Order.findOne({ orderId });
        const user = await User.findOne({ phone: order.userId })
        let shortestDistanceV = Infinity;
        let closestvendor = null;
        vendors.forEach(vendor => {
            const distance = calculateDistance(latitude, longitude, vendor.geoCoordinates.latitude, vendor.geoCoordinates.longitude);
            if (distance < shortestDistanceV) {
                shortestDistanceV = distance;
                closestvendor = vendor;
            }
        });

        const logistics = await Logistic.find({
            availability: true,
            currentActiveOrders: { $lt: "$capacity" }
        });
        let shortestDistanceL = Infinity;
        let closestlogistic = null;
        logistics.forEach(logistic => {
            const distance = calculateDistance(user.geoCoordinates.latitude, user.geoCoordinates.longitude, logistic.geoCoordinates.latitude, logistic.geoCoordinates.longitude);
            if (distance < shortestDistanceL) {
                shortestDistanceL = distance;
                closestlogistic = logistic;
            }
        });

        closestvendor.currrentActiveOrders += 1;
        closestvendor.orders.push(orderId) //array of orders for vendor
        await closestvendor.save()

        closestlogistic.currrentActiveOrders += 1;
        closestlogistic.orders.push(orderId)
        await closestlogistic.save()

        order.status = "readyToPickup"
        order.logisticId.push(closestlogistic.logisticId)
        order.vendorId = closestvendor.logisticId
        await order.save()

        res.json({ shortestDistanceV, closestvendor, shortestDistanceL, closestlogistic });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}