const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    serviceId: {
        type: String,
        unique: true
    },
    serviceName: {
        type: String
    },
    vendorCommission: {
        type: Number
    },
    items: [{
        itemId: {
            type: String
        },
        name: {
            type: String
        },
        unitPrice: {
            type: Number
        }
    }]
}, { versionKey: false });

ServiceSchema.pre('save', async function (next) {
    try {
        if (!this.serviceId) {
            const highestService = await mongoose.model('Service').findOne({}, { serviceId: 1 }, { sort: { 'serviceId': -1 } });
            let newServiceId = 'SE00001'; // Starting with SE00001

            if (highestService) {
                const lastServiceIdNumber = parseInt(highestService.serviceId.replace(/[^\d]/g, ''), 10);
                const nextServiceIdNumber = lastServiceIdNumber + 1;
                const serviceIdLength = highestService.serviceId.length - 2; // 'SE' part is 2 characters

                newServiceId = `SE${String(nextServiceIdNumber).padStart(serviceIdLength, '0')}`;
            }

            this.serviceId = newServiceId;
        }
        next();
    } catch (error) {
        next(error);
    }
});

ServiceSchema.pre('save', async function (next) {
    try {
        if (this.items && this.items.length > 0) {
            // Find the highest itemId among all items in the database
            const allItems = await mongoose.model('Service').find({}, { items: 1 });
            let highestItemId = 0;

            allItems.forEach(service => {
                service.items.forEach(item => {
                    const itemIdNumber = parseInt(item.itemId.replace(/[^\d]/g, ''), 10);
                    if (itemIdNumber > highestItemId) {
                        highestItemId = itemIdNumber;
                    }
                });
            });

            let newItemId = `IT${highestItemId + 1}`;

            this.items.forEach(item => {
                if (!item.itemId) {
                    item.itemId = newItemId;
                }
            });
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Service", ServiceSchema);
