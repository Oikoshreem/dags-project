const jwt = require("jsonwebtoken");
const User = require("../../models/user/user.model");
const bcrypt = require("bcrypt");
const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");

exports.register = async (req, res) => {
    const { phone, name } = req.body;
    const ip = req.ip;
    if (!phone) {
        return res.status(400).json({
            message: "No phone number provided"
        })
    }
    const checkUserPresent = await User.findOne({ phone });

    if (checkUserPresent) {
        return res.status(401).json({
            success: false,
            message: "User already exists"
        })
    }
    const phoneOTP = generateOTP();
    const hashedOTP = await bcrypt.hash(phoneOTP, 10);

    try {
        const user = await User.create({ phone, name, OTP: hashedOTP });
        console.log("user otp", phoneOTP)
        sendOTP(phoneOTP, phone);
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        user.lastLogin = currentTime
        if (!user.ip.includes(ip)) {
            user.ip.push(ip);
            await user.save();
        }
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create user",
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
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const otpMatch = await bcrypt.compare(otp, user.OTP);
        if (!otpMatch) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }
        const lastLoginTime = new Date(user.lastLogin);
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
            { phone: user.phone, id: user._id, name: user.name },
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
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                message: "Please register first"
            });
        }
        const phoneOTP = generateOTP();
        const hashedOTP = await bcrypt.hash(phoneOTP, 10);
        user.OTP = hashedOTP;
        await user.save();
        console.log(user, phoneOTP)
        sendOTP(phoneOTP, phone);
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        user.lastLogin = currentTime
        await user.save();
        if (!user.ip.includes(ip)) {
            user.ip.push(ip);
            await user.save();
        }
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: error.message
        });
    }
}

exports.addAddress = async (req, res) => {
    const { phone, latitude, longitude, address, pincode } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (latitude && longitude) {
            user.geoCoordinates.latitude = latitude;
            user.geoCoordinates.longitude = longitude;
        }
        if (pincode) {
            user.pincode = pincode;
        }
        if (address) {
            user.address.push(address);
        }
        await user.save();

        return res.status(200).json({ message: "Address added successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.fetchAddress = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone: phone })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            address: user.address
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateUser = async (req, res) => {
    const { phone } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { phone: phone },
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: "User Updated successfully",
            updatedUser
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.fetchProfile = async (req, res) => {
    try {
        const { phone } = req.body

        const user = await User.findOne({ phone: phone })

        res.status(200).json({
            message: "user fetched successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
}