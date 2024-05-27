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
        console.log(vendor.vendorId)
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            vendor,
            vendorId:vendor.vendorId
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
                expiresIn: "1d",
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

exports.fetchProfile = async (req, res) => {
    try {
        const { vendorId } = req.body

        const vendor = await Vendor.findOne({ vendorId })

        res.status(200).json({
            message: "vendor fetched successfully",
            vendor
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
}

exports.updateProfile = async (req, res) => {
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

exports.updateDocs = async (req, res) => {
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

exports.switchAvailability = async (req, res) => {
    try {
        const { vendorId } = req.body;
        const vendor = await Vendor.findOne(vendorId)
        if (!vendor) {
            return res.status(404).json({ error: 'vendorId not found' });
        }
        vendor.availability = !vendor.availability;
        await vendor.save()
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}