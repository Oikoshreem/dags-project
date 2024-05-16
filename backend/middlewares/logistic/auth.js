const Logistic = require('../../models/logistic/delivery.model');

exports.verifyLogistic = async (req, res, next) => {
    try {
        const { logisticId } = req.body;
        const logistic = await Logistic.findOne({ logisticId });

        if (!logistic) {
            return res.status(404).json({ error: "Logistic not found" });
        }

        if (logistic.verificationStatus !== 'active') {
            return res.status(403).json({ error: "Logistic is not verified" });
        }
        next();
    } catch (error) {
        console.error("Error verifying Logistic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
