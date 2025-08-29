const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    month: String, // e.g., '2023-10'
    totalAmount: Number,
    breakdown: {
        payPerUse: { amount: Number, totalRequests: Number },
        bundle: { amount: Number, totalRequests: Number, discount: Number },
        event: { amount: Number, totalRequests: Number },
    },
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
