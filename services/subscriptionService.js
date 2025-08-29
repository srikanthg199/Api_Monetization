const Subscription = require('../models/Subscription');
const Client = require('../models/Client');
const Bundle = require('../models/Bundle');
const Event = require('../models/Event');

exports.createUserSubscription = async ({ clientId, subscriptionId }) => {
    const client = await Client.findById(clientId);
    if (!client) {
        const e = new Error('Client not found');
        e.code = 404;
        throw e;
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) { const e = new Error('Subscription not found'); e.code = 404; throw e; }
    if (subscription.status !== 'active') { const e = new Error('Subscription is not active'); e.code = 400; throw e; }

    const already = (client.subscriptions || []).some(id => String(id) === String(subscriptionId));
    if (already) { const e = new Error('Client already subscribed to this plan'); e.code = 400; throw e; }

    await Client.updateOne(
        { _id: clientId },
        { $addToSet: { subscriptions: subscription._id } }
    );

    return subscription;
};

exports.getAll = async () => {
    return Subscription.find()
}