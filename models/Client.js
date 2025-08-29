const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: String,
    email: String,
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }], // References to subscriptions
});

module.exports = mongoose.model('Client', ClientSchema);
