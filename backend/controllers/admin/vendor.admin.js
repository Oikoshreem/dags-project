const Order = require('../../models/user/order.model');
const Vendor = require('../../models/vendor/vendor.model');

exports.fetchAllVendor = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        return res.status(200).json({
            vendors,
            message: "Vendors fetched successfully"
        })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to find vendors",
                error: error.message,
            });
    }
}

exports.getVendor = async (req, res) => {
    try {
        const { vendorId } = req.body;

        const vendor = await Vendor.find({ vendorId })
        return res.status(200).json({
            mesage: "vendor fetched sucessfully",
            vendor
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to find vendor",
            error: error.message,
        });
    }
}

exports.editVendor = async (req, res) => {
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

exports.createvendor = async (req, res) => {
    try {
        const { email, phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Please enter a mobile number." });
        }
        let existingPhone = await Vendor.findOne({ phone });
        let existingEmail;
        if (email) {
            existingEmail = await Vendor.findOne({ email });
        }
        if (existingPhone || existingEmail) {
            return res.status(400).json({ message: "Vendor already exists." });
        }
        const newVendor = await Vendor.create(req.body);
        res.status(201).json({
            message: 'Vendor record created successfully',
            data: newVendor
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating vendor ',
            error: error.message
        });
    }
};

exports.fetchVendorOrders = async (req, res) => {
    try {
        const { vendorId } = req.body;
        const orders = await Order.find({ vendorId })
        res.json({
            message: "All Orders for vendor fetched successfully",
            orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed ",
            error: error.message,
        });
    }
}
