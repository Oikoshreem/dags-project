const Admin = require('../../models/admin/admin');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { generateOTP, sendOTP } = require('../../utils/admin/generateOTP')


exports.credentials = async (req, res) => {
    try {
        const { email, password, isNewIP } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing Fields" });
        }

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const phone = admin.phone
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        console.log(isPasswordCorrect)
        if (isPasswordCorrect) {
            const currentTime = new Date().toISOString();
            admin.last_login = currentTime;
            await admin.save();

            if (isNewIP) {
                const phoneOTP = generateOTP();
                console.log(phoneOTP)
                req.session[admin.phone] = { phoneOTP };
                sendOTP(phoneOTP, phone)
                const smsMessage = `Your OTP is: ${phoneOTP}. This OTP is valid for 5 minutes.`;
                return res.status(200).json({ success: true, message: 'OTP sent successfully', isNewIP });
            } else {
                const token = jwt.sign(
                    { email: admin.email, id: admin._id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "30m",
                    }
                );

                const options = {
                    expires: new Date(Date.now() + 30 * 60 * 1000),
                    httpOnly: true,
                };
                res.cookie("token", token, options).status(200).json({
                    success: true,
                    token
                });
            }

        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: `Login Failure Please Try Again`,
        });
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { userOTP, phone } = req.body;

        const sessionData = req.session[phone];
        if (!sessionData) {
            return res.status(400).json({ success: false, message: "Session not found" });
        }
        const admin = await Admin.findOne({ phone: phone });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const { phoneOTP } = sessionData;

        if (!userOTP || !phoneOTP) {
            return res.status(400).json({ success: false, message: "Both user OTP and admin OTP are required" });
        }

        if (userOTP !== phoneOTP) {
            return res.status(401).json({ success: false, message: "OTP verification failed" });
        }

        const lastLoginTime = new Date(admin.last_login);
        const currentTime = new Date();
        const timeDiff = Math.abs(currentTime - lastLoginTime);
        const minutesDiff = Math.ceil(timeDiff / (1000 * 60));

        if (minutesDiff > 5) {
            return res.status(401).json({ success: false, message: "OTP expired" });
        }

        const token = jwt.sign(
            { email: admin.email, id: admin._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "30m",
            }
        );

        const options = {
            expires: new Date(Date.now() + 30 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            message: "OTP verification successful"
        });

    } catch (error) {
        return res.status(500).json({ success: false,error:error.message, message: "OTP verification failed. Please try again." });
    }
}

exports.twoSV = async (req, res) => {
    const { isNewIP, passcode, phone } = req.body
    const ip = req.ip
    try {
        const admin = await Admin.findOne({ phone: phone });
        console.log(admin)
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found!!!" });
        }

        if (admin.passcode !== passcode) {
            return res.status(400).json({ success: false, message: "Invalid passcode" });
        }

        if (isNewIP) {
            if (!admin.ips.includes(ip)) {
                admin.ips.push(ip);
                await admin.save();
            }
        }
        return res.status(200).json({ success: true, message: "Passcode verification successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to verify passcode', error: error.message });
    }
}