const Feedback = require("../../models/user/feedback.model");
const Order = require("../../models/user/order.model");

exports.giveReview = async (req, res) => {
    const { orderId, feedback, rating } = req.body;
    const order = await Order.find(orderId)
    if (!order) {
        res.json({ mesage: "No order found" })
    }

    const feed = await Feedback.create({
        feedback,
        rating,
        userId: order.userId
    })

    return res.json({
        message:"feedback created successfully",
        feedback:feed
    })
}