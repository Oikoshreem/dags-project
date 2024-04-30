const Vendor = require('../../models/vendor/vendor.model');

exports.fetchVendor = async (req, res) => {
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

exports.updateVendor = async (req, res) => {
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