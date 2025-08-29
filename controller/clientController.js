const clientService = require('../services/clientService');

exports.create = async (req, res) => {
    try {
        const client = await clientService.createClient(req.body);
        res.status(201).json({ status: true, message: 'Client created successfully', data: client });
    } catch (e) {
        const code = e.code === 'DUPLICATE' ? 409 : 500;
        res.status(code).json({ status: false, message: e.message || 'Failed to create client' });
    }
};

exports.getById = async (req, res) => {
    try {
        const client = await clientService.getClientById(req.params.id);
        if (!client) return res.status(404).json({ status: false, message: 'Client not found' });
        res.json({ status: true, data: client });
    } catch (e) {
        res.status(500).json({ status: false, message: 'Failed to retrieve client' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const clients = await clientService.getClients();
        res.json({ status: true, data: clients })
    } catch (e) {
        res.status(500).json({ status: false, message: 'Failed to retrieve clients' });
    }
}