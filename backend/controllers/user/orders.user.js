const Order = require("../../models/user/order.model");
const User = require("../../models/user/user.model");

exports.fetchService = async(req,res)=>{}

exports.createOrder = async (req, res) => {
    try {
        const { userid, ...updates } = req.body;
        const user = await User.findOne({ phone: userid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        const order = await Order.create({
            userId: userid,
            orderDate: currentTime,
            updates
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message,
        });
    }
};

exports.cancelOrder = async(req,res)=>{}
exports.addtocart = async(req,res)=>{}
