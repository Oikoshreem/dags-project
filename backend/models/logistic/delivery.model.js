const mongoose = require("mongoose");

const DeliveryPartnerSchema = new mongoose.Schema({
    partnerId: {
        type: String,
        unique: true
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
    ip: [{
        type: String
    }],
    createdOn: {
        type: Date
    }
}, { versionKey: false });

DeliveryPartnerSchema.pre('save', async function (next) {
    try {
        if (!this.partnerId) {
            const highestPartner = await mongoose.model('Logistic').findOne({}, { partnerId: 1 }, { sort: { 'partnerId': -1 } });
            let newpartnerId = 'L1';

            if (highestPartner) {
                const lastpartnerIdNumber = parseInt(highestPartner.partnerId.replace(/[^\d]/g, ''), 10);
                newpartnerId = `L${lastpartnerIdNumber + 1}`;
            }

            this.partnerId = newpartnerId;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Logistic", DeliveryPartnerSchema);
