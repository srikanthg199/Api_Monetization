const subscriptionService = require('../services/subscriptionService');

exports.create = async (req, res) => {
    try {
        const sub = await subscriptionService.createUserSubscription(req.body);
        res.status(201).json({ status: true, message: 'Subscription created successfully', data: sub });
    } catch (e) {
        const code = e.code === 'CONFLICT' || e.code === 409 ? 409 : (e.code === 404 ? 404 : 500);
        res.status(code).json({ status: false, message: e.message || 'Failed to create subscription' });
    }
};

exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await subscriptionService.getAll();
        res.status(200).json({ status: true, message: "Subscriptions fetched successfully", subscriptions })
    } catch (error) {
        res.status(code).json({ status: false, message: e.message || 'Failed to create subscription' });
    }
}