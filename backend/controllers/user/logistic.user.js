const Logistic = require('../../models/logistic/delivery.model');
const Vendor = require('../../models/vendor/vendor.model');
const calculateDistance = require('../../utils/logistic/shortestdistance');

exports.ShortestDistanceforUser = async (req, res) => {
    try {
        const { latitude, longitude, orderId } = req.body;  //user coordinates
        const vendors = await Vendor.find({ availability: true });

        let shortestDistanceV = Infinity;
        let closestvendor = null;
        vendors.forEach(vendor => {
            const distance = calculateDistance(latitude, longitude, vendor.geoCoordinates.latitude, vendor.geoCoordinates.longitude);
            if (distance < shortestDistanceV) {
                shortestDistanceV = distance;
                closestvendor = vendor;
            }
        });

        const logistics = await Logistic.find({ availability: true });
        let shortestDistanceL = Infinity;
        let closestlogistic = null;
        logistics.forEach(logistic => {
            const distance = calculateDistance(latitude, longitude, logistic.geoCoordinates.latitude, logistic.geoCoordinates.longitude);
            if (distance < shortestDistanceL) {
                shortestDistanceL = distance;
                closestlogistic = logistic;
            }
        });

        closestvendor.currrentActiveOrders +=1;
        closestvendor.orders.push= orderId 
        await closestvendor.save()

        closestlogistic.currrentActiveOrders +=1;
        closestlogistic.orders.push= orderId 
        await closestlogistic.save()

        res.json({ shortestDistanceV, closestvendor, shortestDistanceL, closestlogistic });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.giveReviewToLogistic = async (req, res) => { }