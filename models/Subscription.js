const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    name: { type: String, default: null }, // Optional label like "Production Bundle"
    type: { type: String, enum: ['payPerUse', 'bundle', 'event'], required: true },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    priority: { type: Number, default: 1 }, // Higher wins in resolver
    details: {
        // For bundles: bundleId (threshold and discount come from Bundle model)
        bundleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bundle' },
        // For events: eventId
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);