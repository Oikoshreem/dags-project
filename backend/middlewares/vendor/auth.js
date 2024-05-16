const Vendor = require('../../models/vendor/vendor.model');

exports.verifyVendor = async (req, res, next) => {
    try {
        const { vendorId } = req.body;
        const vendor = await Vendor.findOne({ vendorId });

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        if (vendor.verificationStatus !== 'active') {
            return res.status(403).json({ error: "Vendor is not verified" });
        }
        next();
    } catch (error) {
        console.error("Error verifying vendor:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
