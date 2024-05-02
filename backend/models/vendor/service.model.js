const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    serviceId: {
        type: String,
        unique: true
    },
    serviceName: {
        type: String
    },
    items: [{
        itemId: {
            type: String
        },
        name: {
            type: String
        },
        unitPrice: {
            type: String
        }
    }]
}, { versionKey: false });

ServiceSchema.pre('save', async function (next) {
    try {
        if (!this.serviceId) {
            const highestOrder = await mongoose.model('Service').findOne({}, { serviceId: 1 }, { sort: { 'serviceId': -1 } });
            let newserviceId = 'SE1';

            if (highestOrder) {
                const lastserviceIdNumber = parseInt(highestOrder.serviceId.replace(/[^\d]/g, ''), 10);
                newserviceId = `SE${lastserviceIdNumber + 1}`;
            }

            this.serviceId = newserviceId;
        }
        next();
    } catch (error) {
        next(error);
    }
});

ServiceSchema.pre('save', async function (next) {
    try {
        this.items.forEach(item => {
            if (!item.itemId) {
                const highestItem = this.items.reduce((prev, current) => (parseInt(prev.itemId.replace(/[^\d]/g, ''), 10) > parseInt(current.itemId.replace(/[^\d]/g, ''), 10)) ? prev : current, { itemId: 'IT0' });
                let newItemId = 'IT1';

                if (highestItem.itemId !== 'IT0') {
                    const lastItemIdNumber = parseInt(highestItem.itemId.replace(/[^\d]/g, ''), 10);
                    newItemId = `IT${lastItemIdNumber + 1}`;
                }

                item.itemId = newItemId;
            }
        });
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model("Service", ServiceSchema);
