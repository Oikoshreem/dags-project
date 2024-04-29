const Admin = require('../../models/admin/admin');
const User = require('../../models/user/user.model');
const mailSender = require('../../utils/admin/mailSender');
const sendBulkEmails = require('../../Tempelates/bulkEmail.js')

exports.fetchUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            users,
            message: "Users fetched successfully"
        })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to find users",
                error: error.message,
            });
    }
}

exports.editUser = async (req, res) => {
    const phone = req.body.phone;
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
};

exports.getUser = async (req, res) => {
    try {
        const { phone } = req.body;

        const user = await User.find({ phone })
        return res.status(200).json({
            mesage: "User fetched sucessfully",
            user
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to find user",
            error: error.message,
        });
    }
}

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        return res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

exports.sendBulkEmails = async (req, res) => {
    try {
        const { emails, title } = req.body;

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ message: "Please provide valid email addresses." });
        }

        const emailOptions = {
            from: 'sender@gamil.com.com',
            subject: title,
            html: sendBulkEmails(),
            bcc: emails 
        };

        const emailResponse = await mailSender(emailOptions);

        return res.status(200).json({ message: "Bulk emails sent successfully.", emailResponse });
    } catch (error) {
        console.error("Error sending bulk emails:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.viewFeedbacks = async (req, res) => { }
exports.getUser = async (req, res) => { }