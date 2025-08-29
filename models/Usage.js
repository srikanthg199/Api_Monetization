const mongoose = require('mongoose');

const UsageSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    apiId: { type: mongoose.Schema.Types.ObjectId, ref: 'Api', required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    planType: { type: String, enum: ['payPerUse', 'bundle', 'event'], required: true },
    cost: { type: Number, required: true }, // Final cost for this API call
    metadata: { type: Object, default: {} }, // Optional extra details (like rate plan, discount info)
}, { timestamps: true });

module.exports = mongoose.model('Usage', UsageSchema);
