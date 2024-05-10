const Service = require('../../models/vendor/service.model');

exports.createService = async (req, res) => {
    const { name, commission } = req.body;

    try {
        const newService = await Service.create({
            serviceName: name,
            vendorCommission: commission
        });

        res.status(201).json(newService);
    } catch (err) {
        console.error('Error creating service:', err);
        res.status(500).json({ error: 'Could not create service' });
    }
}

exports.addItemToService = async (req, res) => {
    const { serviceId, itemName, unitPrice } = req.body;

    try {
        const service = await Service.findOne({ serviceId: serviceId });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        if (!itemName && !unitPrice) {
            return res.status(404).json({ error: 'No item details provided' });
        }
        service.items.push({
            name: itemName,
            unitPrice: unitPrice
        });

        await service.save();

        res.status(200).json(service);
    } catch (err) {
        res.status(500).json({
            error: 'Could not add item to service',
            message: err.message
        });
    }
}

exports.editService = async (req, res) => {
    const { serviceId, newName, newCommission } = req.body;

    try {
        const service = await Service.findOne({ serviceId });

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        if (newName) {
            service.serviceName = newName;
        }
        if (newCommission) {
            service.vendorCommission = newCommission;
        }

        await service.save();

        res.json({ message: "Service updates successfully", service });
    } catch (error) {
        res.status(500).json({ error: 'Could not edit service', message: error.message });
    }
};

exports.editItemInService = async (req, res) => {
    const { serviceId, itemId, newName, newUnitPrice } = req.body;

    try {
        const service = await Service.findOne({ serviceId });

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const item = service.items.find(item => item.itemId === itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found in service' });
        }

        if (newName) {
            item.name = newName;
        }
        if (newUnitPrice) {
            item.unitPrice = newUnitPrice;
        }

        await service.save();

        res.json({ message: "Service updates successfully", service });
    } catch (error) {
        res.status(500).json({ error: 'Could not edit item in service', message: error.message });
    }
};

exports.fetchServices = async (req, res) => {
    try {
        const service = await Service.find()
        res.json({ message: "Service fetched successfully", service });
    } catch (error) {
        res.status(500).json({ error: 'Could not find service', message: error.message });
    }
}