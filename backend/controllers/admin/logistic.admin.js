const Logistic = require('../../models/logistic/delivery.model');
const Order = require('../../models/user/order.model');

exports.fetchLogistic = async (req, res) => {
    try {
        const logistics = await Logistic.find();
        return res.status(200).json({
            logistics,
            message: "Logistic partners fetched successfully"
        })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to find Logistic partners",
                error: error.message,
            });
    }
}

exports.getLogistic = async (req, res) => {

    try {
        const { logisticId } = req.body;

        const logistic = await Logistic.find({ logisticId })
        return res.status(200).json({
            mesage: "Logistic partner fetched sucessfully",
            logistic
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to find Logistic Partner",
            error: error.message,
        });
    }
}

exports.updateLogistic = async (req, res) => {
    const { logisticId } = req.body;
    try {
        const updateLogistic = await Logistic.findOneAndUpdate(
            { logisticId: logisticId },
            req.body,
            { new: true }
        );
        if (!updateLogistic) {
            return res.status(404).json({ message: 'Logistic not found' });
        }
        res.status(200).json({
            message: "Logistic Partner Updated successfully",
            updateLogistic
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.createLogistic = async (req, res) => {
    try {
        const { email, phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Please enter a mobile number." });
        }
        let existingPhone = await Logistic.findOne({ phone });
        let existingEmail;
        if (email) {
            existingEmail = await Logistic.findOne({ email });
        }
        if (existingPhone || existingEmail) {
            return res.status(400).json({ message: "Logistic already exists." });
        }
        const newLogistic = await Logistic.create(req.body);
        res.status(201).json({
            message: 'Logistic record created successfully',
            data: newLogistic
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating Logistic ',
            error: error.message
        });
    }
};

exports.getLogistic = async (req, res) => {

    try {
        const { logisticId } = req.body;

        const logistic = await Logistic.find({ logisticId })
        return res.status(200).json({
            mesage: "Logistic partner fetched sucessfully",
            logistic
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to find Logistic Partner",
            error: error.message,
        });
    }
}

exports.fetchlogisticOrders = async(req,res)=>{
        try {
            const { logisticId } = req.body;
            const logistic = await Logistic.findOne({ logisticId });
            const orderIds = logistic.orders
            const orders = await Order.find({ orderId: { $in: orderIds } });//will get all orders even repeated orders 
    
            // const activeOrders = orders.filter(order => {
            //     const orderStatusLength = order.orderStatus.length;
            //     return orderStatusLength === 4 || orderStatusLength === 7;
            // });  //if index is 7 then if the same logisticid is present in 4 then that order isd already done at 4 and not consider as active
    
            return res.status(200).json({ orders });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
}