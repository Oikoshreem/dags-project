const mongoose = require("mongoose");

const DeliveryPartnerSchema = new mongoose.Schema({
    logisticId: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    profile_pic: {
        type: String
    },
    OTP: {
        type: String
    },
    docType: {
        type: String
    },
    document: {
        type: String
    },
    verificationStatus: {
        type: String,
        default: 'pending'
    },
    currentActiveOrder: {
        type: Boolean
    },
    capacity: {
        type: Number
    },
    availability: {
        type: Boolean
    },
    geoCoordinates: {
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    status: {
        type: String
    },
    orders: [{
        type: String,
    }],
    lastLogin: {
        type: Date
    },
    locationLog: [{
        type: Boolean
    }],
    ip: [{
        type: String
    }],
    activeLog:[{
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
    }],
    createdOn: {
        type: Date
    } //add array of location history 
}, { versionKey: false });

DeliveryPartnerSchema.pre('save', async function (next) {
    try {
        if (!this.logisticId) {
            const highestPartner = await mongoose.model('Logistic').findOne({}, { logisticId: 1 }, { sort: { 'logisticId': -1 } });
            let newlogisticId = 'L1';

            if (highestPartner) {
                const lastlogisticIdNumber = parseInt(highestPartner.logisticId.replace(/[^\d]/g, ''), 10);
                newlogisticId = `L${lastlogisticIdNumber + 1}`;
            }

            this.logisticId = newlogisticId;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Logistic", DeliveryPartnerSchema);
