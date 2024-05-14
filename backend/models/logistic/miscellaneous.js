const mongoose = require("mongoose");

const MiscellaneousSchema = new mongoose.Schema({
    dist: {
        5: {
            type: Number
        },
        10: {
            type: Number
        },
        20: {
            type: Number
        },
        30: {
            type: Number
        }
        //add faq related things
    },
    createdOn: {
        type: Date
    } 
}, { versionKey: false });

module.exports = mongoose.model("Misc", MiscellaneousSchema);
