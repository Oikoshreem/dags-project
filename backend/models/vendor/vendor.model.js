const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String
    },
    profilePic: {
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
    OTP: {
        type: String
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
    currrentActiveOrders: {
        type: Number
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
        type: String
    }],
    lastLogin: {
        type: Date
    },
    ip: [{
        type: String
    }],
    createdOn: {
        type: Date,
    }
}, { versionKey: false });

VendorSchema.pre('save', async function (next) {
    try {
        if (!this.vendorId) {
            const highestVendor = await mongoose.model('Vendor').findOne({}, { vendorId: 1 }, { sort: { vendorId: -1 } });
            let newVendorId = 'VE1';

            if (highestVendor) {
                const lastVendorIdNumber = parseInt(highestVendor.vendorId.replace(/[^\d]/g, ''), 10);
                newVendorId = `VE${lastVendorIdNumber + 1}`;
            }

            this.vendorId = newVendorId;
        }
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model("Vendor", VendorSchema);


