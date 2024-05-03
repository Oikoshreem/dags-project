const Logistic = require('../../models/logistic/delivery.model');
const calculateDistance = require('../../utils/logistic/shortestdistance');
exports.findShortestDistance = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const deliveryPartners = await Logistic.find({ availability: true });

        let shortestDistance = Infinity;
        let closestPartner = null;
        deliveryPartners.forEach(partner => {
            const distance = calculateDistance(latitude, longitude, partner.geoCoordinates.latitude, partner.geoCoordinates.longitude);
            if (distance < shortestDistance) {
              shortestDistance = distance;
              closestPartner = partner;
            }
          });
      
          res.json({ shortestDistance, closestPartner });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}