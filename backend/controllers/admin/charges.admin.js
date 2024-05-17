const Misc = require('../../models/logistic/miscellaneous'); // Adjust the path as needed

// Create a new Misc document
exports.createMisc = async (req, res) => {
    try {
        const { dist, faq } = req.body;

        const newMisc = new Misc({
            dist: {
                five: dist.five,
                ten: dist.ten,
                twenty: dist.twenty,
                thirty: dist.thirty
            },
            faq: {
                question: faq.question,
                answer: faq.answer
            }
        });

        const savedMisc = await newMisc.save();

        res.status(201).json(savedMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
