const mongoose = require("mongoose");

const MiscellaneousSchema = new mongoose.Schema({
    5: {
        type: Number
    },
    10: {
        type: Number
    },
    15: {
        type: Number
    },
    20: {
        type: Number
    },
    dist: {
        5: {
            type: Number
        },
        10: {
            type: Number
        }, 
        15: {
            type: Number
        },
        20: {
            type: Number
        },
        //add faq related things
    },
    createdOn: {
        type: Date
    } 
}, { versionKey: false });

module.exports = mongoose.model("Misc", MiscellaneousSchema);
