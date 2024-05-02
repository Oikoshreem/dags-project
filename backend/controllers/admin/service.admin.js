const Service = require('../../models/vendor/service.model');

exports.createService = async (req, res) => {
    const { serviceName } = req.body;

    try {
        const newService = await Service.create({
            serviceName: serviceName
        });

        res.status(201).json(newService);
    } catch (err) {
        console.error('Error creating service:', err);
        res.status(500).json({ error: 'Could not create service' });
    }
}

exports.addItemToService = async (req, res) => {
    const { serviceId } = req.params;
    const { itemName, unitPrice } = req.body;

    try {
        const service = await Service.findOne({ serviceId: serviceId });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        service.items.push({
            name: itemName,
            unitPrice: unitPrice
        });

        await service.save();

        res.status(200).json(service);
    } catch (err) {
        console.error('Error adding item to service:', err);
        res.status(500).json({ error: 'Could not add item to service' });
    }
}