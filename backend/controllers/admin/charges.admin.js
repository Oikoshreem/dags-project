const Misc = require('../../models/logistic/miscellaneous'); // Adjust the path as needed

exports.createDeliveryCharge = async (req, res) => {
    try {
        const { dist } = req.body;
        const existingMisc = await Misc.findOne();
        if (existingMisc) {
            return res.status(400).json({
                message: "Charges already created"
            });
        }
        const newMisc = await Misc.create({
            dist: {
                five: dist.five,
                ten: dist.ten,
                twenty: dist.twenty,
                thirty: dist.thirty
            }
        });

        res.status(201).json(newMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;

        const updatedMisc = await Misc.findOneAndUpdate(
            {},
            { $push: { faq: { question, answer } } },
            { new: true, upsert: true }
        );

        res.status(200).json(updatedMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFAQ = async (req, res) => {
    try {
        const { faqId, question, answer } = req.body;

        const updatedMisc = await Misc.findOneAndUpdate(
            { "faq._id": faqId },
            {
                $set: {
                    "faq.$.question": question,
                    "faq.$.answer": answer
                }
            },
            { new: true }
        );

        if (!updatedMisc) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        res.status(200).json(updatedMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteFAQ = async (req, res) => {
    try {
        const { faqId } = req.body;

        const updatedMisc = await Misc.findOneAndUpdate(
            {},
            { $pull: { faq: { _id: faqId } } },
            { new: true }
        );

        if (!updatedMisc) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        res.status(200).json(updatedMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.additionaldetails = async (req, res) => {
    try {
        const { tnc, shippingPolicy, privacyPolicy, refundPolicy } = req.body;

        const misc = await Misc.findOne();
        if (!misc) { 
            return res.status(404).json({ message: "Misc document not found" });
        }

        if (tnc) {
            misc.tnc = tnc;
        }
        if (shippingPolicy) {
            misc.shippingPolicy = shippingPolicy;
        }
        if (privacyPolicy) {
            misc.privacyPolicy = privacyPolicy;
        }
        if (refundPolicy) {
            misc.refundPolicy = refundPolicy;
        }

        const updatedMisc = await misc.save();

        res.status(200).json(updatedMisc);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.fetchMisc = async (req, res) => {
    try {
        const charges = await Misc.findOne({})
        return res.json({
            charges: charges
        })
    } catch (error) {
        res.status(500).json({ message: "Error creating bank details.", error: error.message });
    }
}