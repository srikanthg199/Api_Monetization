const billingService = require("../services/billingService")
exports.generateInvoice = async (req, res) => {
    try {
        const { clientId, month } = req.query;
        const invoice = await billingService.generateMonthlyInvoice(clientId, month);
        res.json({ status: true, message: 'Invoice generated successfully', data: invoice });
    } catch (e) {
        console.error('Invoice generation error:', e);
        res.status(500).json({ status: false, message: 'Failed to generate invoice' });
    }
};