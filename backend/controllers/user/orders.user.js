const Order = require("../../models/user/order.model");
const User = require("../../models/user/user.model");
const Service = require("../../models/vendor/service.model");

exports.fetchService = async(req,res)=>{}

exports.createOrder = async (req, res) => {
    try {
        const { orders , vendorId , phone, ...updates } = req.body; 

        const orderItems = [];
        let allAmount= []
        const user = await User.findOne({ phone });
        for (const order of orders) {
            const { itemId, qty, serviceId } = order;

            const service = await Service.findOne({ serviceId });
            if (!service) {
                return res.status(404).json({ message: `Service with ID ${serviceId} not found` });
            }
            let unitPrice= 0;
            const Amount = service.items.reduce((acc, item) => {
                if (item.itemId === itemId) {
                    unitPrice=item.unitPrice;
                    return acc + (item.unitPrice * qty);
                }
                return acc;
            }, 0);

            allAmount.push(Amount)

            orderItems.push({
                itemId,
                qty,
                serviceId,
                unitPrice,
            });
        }
        console.log("whyyyyy",user)
        // console.log(orderItems)
        const newOrder = new Order(Object.assign({
            items: orderItems,
            userId:phone,
            vendorId,
            amount:allAmount,
            orderStatus: [{ status: "Initiated" }],
            orderTime: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        }, updates)); 
        await newOrder.save();

        const orderId = newOrder.orderId;
        user.orders.push(orderId);
        await user.save(); 

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateOrder = async(req,res)=>{}

exports.cancelOrder = async(req,res)=>{}

// exports.createOrder = async (req, res) => {
    //     const { orders, vendorId, ...updates } = req.body; 
    
    //     const orderItems = [];
    //     let totalAmount = 0; 
        
    //     for (const order of orders) {
    //         const { itemId, qty, serviceId } = order;
        
    //         const service = await Service.findOne({ serviceId });
    //         if (!service) {
    //             return res.status(404).json({ message: `Service with ID ${serviceId} not found` });
    //         }
        
    //         const amount = service.items.reduce((acc, item) => {
    //             if (item.itemId === itemId) {
    //                 return acc + (item.unitPrice * qty);
    //             }
    //             return acc;
    //         }, 0);
        
    //         orderItems.push({
    //             itemId,
    //             qty,
    //             serviceId,
    //             unitPrice: service.items.find(item => item.itemId === itemId).unitPrice, // Assuming you need to include unitPrice
    //             amount // Changed to lower case to avoid conflict with the array declaration
    //         });
        
    //         totalAmount += amount; 
    //     }
        
    //     const newOrder = new Order(Object.assign({
    //         orderStatus: [{ status: "Initiated" }],
    //         items: orderItems,
    //         amount: totalAmount,
    //         vendorId
    //     }, updates)); 
        
    //     await newOrder.save();
        
    //     res.status(201).json({ message: 'Order created successfully', order: newOrder });
        
    // };