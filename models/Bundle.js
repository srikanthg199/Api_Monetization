const mongoose = require('mongoose');

const BundleSchema = new mongoose.Schema({
    name: String,
    description: String,
    apiIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'API' }], // APIs included in this bundle
    basePrice: Number, // Optional base price for the entire bundle
    discountRules: {
        threshold: Number, // Usage threshold (e.g., 100000 calls)
        discountPercentage: Number // Discount percentage (e.g., 0.1 for 10%)
    },
    // Optional: pricing per API in bundle
    apiPricing: [{
        apiId: { type: mongoose.Schema.Types.ObjectId, ref: 'API' },
        customPrice: Number // Override individual API price if needed
    }]
});

module.exports = mongoose.model('Bundle', BundleSchema);
