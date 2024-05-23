const BankDetails = require('../../models/vendor/bankDetails.model');

exports.createBankDetails = async (req, res) => {
    try {
        const {
            accountHolderName,
            bankName,
            accountNumber,
            IFSC,
            branch,
            address,
            bankId,
            bankFor
        } = req.body;

        if (!accountHolderName || !bankName || !accountNumber || !IFSC || !branch || !address || !bankId || !bankFor) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newBankDetails = await BankDetails.create({
            accountHolderName,
            bankName,
            accountNumber,
            IFSC,
            branch,
            address,
            bankId,
            bankFor
        });

        res.status(201).json({ message: "Bank details created successfully.", data: newBankDetails });
    } catch (error) {
        res.status(500).json({ message: "Error creating bank details.", error: error.message });
    }
};

exports.fetchBankDetails = async (req, res) => {
    try {
        const { bankId } = req.body
        const bankDetails = await BankDetails.find(bankId)

        return res.json({
            message: "Fetch bank details successfully",
            bankDetails
        })
    } catch (error) {
        res.status(500).json({ message: "Error fetching bank details.", error: error.message });
    }

}