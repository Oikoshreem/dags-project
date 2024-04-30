const jwt = require("jsonwebtoken");
const Vendor = require("../../models/vendor/vendor.model");
const bcrypt = require("bcrypt");
const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");

exports.register = async (req, res) => {
    const { phone, isNewIP } = req.body;
    const ip = req.ip;
    if (!phone) {
        return res.status(400).json({
            message: "No phone number provided"
        })
    }
    const checkVendorPresent = await Vendor.findOne({ phone });

    if (checkVendorPresent) {
        return res.status(401).json({
            success: false,
            message: "Vendor already exists"
        })
    }
    const phoneOTP = generateOTP();
    const hashedOTP = await bcrypt.hash(phoneOTP, 10);

    try {
        const vendor = await Vendor.create({ phone, OTP: hashedOTP });
        console.log(phoneOTP)
        sendOTP(phoneOTP, phone);
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        vendor.lastLogin = currentTime
        if (!vendor.ip.includes(ip)) {
            vendor.ip.push(ip);
            await vendor.save();
        }
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            vendor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create Vendor",
            error: error.message
        });
    }
}

exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        return res.status(400).json({
            message: "Phone number and OTP are required"
        });
    }

    try {
        const vendor = await Vendor.findOne({ phone });
        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found"
            });
        }
        const otpMatch = await bcrypt.compare(otp, vendor.OTP);
        if (!otpMatch) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }
        const lastLoginTime = new Date(vendor.lastLogin);
        const currentTime = new Date(Date.now() + (330 * 60000));
        const timeDiff = Math.abs(currentTime - lastLoginTime);
        const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
        console.log(minutesDiff)
        if (minutesDiff > 5) {
            return res
                .status(401)
                .json({ success: false, message: "OTP expired" });
        }
        const token = jwt.sign(
            { phone: vendor.phone, id: vendor._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "30m",
            }
        );
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to verify OTP",
            error: error.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { phone } = req.body;
        const ip = req.ip;
        const vendor = await Vendor.findOne({ phone });
        if (!vendor) {
            return res.status(404).json({
                message: "Please register first"
            });
        }
        const phoneOTP = generateOTP();
        const hashedOTP = await bcrypt.hash(phoneOTP, 10);
        vendor.OTP = hashedOTP;
        await vendor.save();

        sendOTP(phoneOTP, phone);
        console.log(phoneOTP)
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        vendor.lastLogin = currentTime
        await vendor.save();
        if (!vendor.ip.includes(ip)) {
            vendor.ip.push(ip);
            await vendor.save();
        }
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            Vendor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: error.message
        });
    }
} 