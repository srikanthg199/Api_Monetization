const Client = require('../models/Client');

exports.createClient = async ({ name, email }) => {
    const exists = await Client.findOne({ email });
    if (exists) {
        const err = new Error('Client with this email already exists');
        err.code = 'DUPLICATE';
        throw err;
    }
    const client = new Client({ name, email });
    await client.save();
    return client;
};

exports.getClientById = async (id) => {
    return Client.findById(id).populate('subscriptions');
};

exports.getClients = async () => {
    return Client.find();
};