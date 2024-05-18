const Vendor = require('../../models/vendor/vendor.model');
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token =
            req.body.token ||
            req.cookies.token
            || req.header("Authorization").replace("Bearer ", "")
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.vendor = decode;
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                error: error.message,
                message: 'Invalid Token'
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Something went wrong while validating the token'
        });
    }
}

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
