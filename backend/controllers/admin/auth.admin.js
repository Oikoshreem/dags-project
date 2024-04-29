const Admin = require("../../models/admin/admin");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");

exports.credentials = async (req, res) => {
    try {
        const { email, password, isNewIP } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Missing Fields" });
        }

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const phone = admin.phone;
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        console.log(isPasswordCorrect);
        if (isPasswordCorrect) {
            const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
            admin.lastLogin = currentTime;
            await admin.save();

            if (isNewIP) {
                const phoneOTP = generateOTP();
                console.log(phoneOTP);
                req.session[admin.phone] = { phoneOTP };
                sendOTP(phoneOTP, phone);
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: "OTP sent successfully",
                        isNewIP,
                    });
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
                    token,
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
};

exports.verifyOTP = async (req, res) => {
    try {
        const { OTP, phone } = req.body;

        const sessionData = req.session[phone];
        if (!sessionData) {
            return res
                .status(400)
                .json({ success: false, message: "Session not found" });
        }
        const admin = await Admin.findOne({ phone: phone });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const { phoneOTP } = sessionData;
        console.log(admin)
        if (!OTP || !phoneOTP) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Both admin OTP and admin OTP are required",
                });
        }

        if (OTP !== phoneOTP) {
            return res
                .status(401)
                .json({ success: false, message: "OTP verification failed" });
        }

        const lastLoginTime = new Date(admin.lastLogin);
        console.log(lastLoginTime)
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
            message: "OTP verification successful",
        });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                error: error.message,
                message: "OTP verification failed. Please try again.",
            });
    }
};

exports.twoSV = async (req, res) => {
    const { isNewIP, passcode, phone } = req.body;
    const ip = req.ip;
    try {
        const admin = await Admin.findOne({ phone: phone });
        console.log(admin);
        if (!admin) {
            return res
                .status(404)
                .json({ success: false, message: "Admin not found!!!" });
        }

        if (admin.passcode !== passcode) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid passcode" });
        }

        if (isNewIP) {
            if (!admin.ip.includes(ip)) {
                admin.ip.push(ip);
                await admin.save();
            }
        }
        return res
            .status(200)
            .json({ success: true, message: "Passcode verification successful" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to verify passcode",
                error: error.message,
            });
    }
};

exports.forgotPassword = async (req, res) => {
    const { password, cpassword, phone } = req.body;

    if (password !== cpassword) {
        return res.status(401).json({
            success: false, message: "Password and confirm Password does not match"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await Admin.find(phone);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({
            success: true, message: "Password reset successful"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: "An error occurred while resetting password"
        });
    }
}

exports.forgotPasscode = async (req, res) => {
    const { passcode, cpasscode, phone } = req.body;

    if (passcode !== cpasscode) {
        return res.status(401).json({
            success: false, message: "Password and confirm Password does not match"
        });
    }

    try {
        const admin = await Admin.find(phone);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        admin.passcode = passcode;
        await admin.save();

        res.status(200).json({
            success: true, message: "Passcode reset successful"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: "An error occurred while resetting passcode"
        });
    }

}