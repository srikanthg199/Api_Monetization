const mongoose = require('mongoose');

const APISchema = new mongoose.Schema({
    name: String,
    endpoint: String,
    pricePerCall: Number, // For Pay-Per-Use
    bundles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bundle' }], // Associated bundles
});

module.exports = mongoose.model('API', APISchema);
