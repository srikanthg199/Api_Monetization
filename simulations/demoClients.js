// This is a script to seed demo data (run once via Node.js)
const mongoose = require('mongoose');
const Client = require('../models/Client');
const API = require('../models/API');
const Event = require('../models/Event');
const Bundle = require('../models/Bundle');
const Subscription = require('../models/Subscription');
const { PRICING, SUBSCRIPTION_PRIORITIES, PLAN_TYPES } = require('../constants/constants');

mongoose.connect('mongodb://localhost:27017/apiMonetization');

async function seedData () {
    try {
        // Clear minimal demo data (optional)
        // await Promise.all([Client.deleteMany({}), API.deleteMany({}), Event.deleteMany({}), Bundle.deleteMany({}), Subscription.deleteMany({})]);

        // Sample clients
        const client1 = await Client.create({ name: 'Client A', email: 'a@example.com' }); // Pay-Per-Use
        const client2 = await Client.create({ name: 'Client B', email: 'b@example.com' }); // Bundle
        const client3 = await Client.create({ name: 'Client C', email: 'c@example.com' }); // Event-Based

        // Sample APIs with pricing from constants
        const api1 = await API.create({
            name: 'Get Data',
            endpoint: '/api/v1/my_api/getData',
            pricePerCall: PRICING.DEFAULT_PRICE_PER_CALL
        });
        const api2 = await API.create({
            name: 'Get Data source 2',
            endpoint: '/api/v1/my_api/getData_2',
            pricePerCall: PRICING.DEFAULT_PRICE_PER_CALL
        });
        const api3 = await API.create({
            name: 'Get Data Available only in Pay as go.',
            endpoint: '/api/v1/my_api/getData_base',
            pricePerCall: PRICING.DEFAULT_PRICE_PER_CALL
        });

        // Sample Bundle using pricing constants
        const bundle1 = await Bundle.create({
            name: 'Data Processing Bundle',
            description: 'Bundle for data processing APIs',
            apiIds: [api1._id, api2._id],
            basePrice: PRICING.BUNDLE_BASE_PRICE,
            discountRules: {
                threshold: PRICING.BUNDLE_THRESHOLD,
                discountPercentage: PRICING.BUNDLE_DISCOUNT_PERCENTAGE
            }
        });

        // Update APIs to reference the bundle
        await API.findByIdAndUpdate(api1._id, { $addToSet: { bundles: bundle1._id } });
        await API.findByIdAndUpdate(api2._id, { $addToSet: { bundles: bundle1._id } });

        // Sample Event using pricing constant
        const event1 = await Event.create({
            name: 'MeterOnboardingEvent',
            fixedPrice: PRICING.EVENT_FIXED_PRICE,
            apiIds: [api1._id, api2._id]
        });

        // Create shared subscriptions using priority constants
        const payPerUseSub = await Subscription.create({
            name: 'Default Pay-Per-Use',
            type: PLAN_TYPES.PAY_PER_USE,
            status: 'active',
            priority: SUBSCRIPTION_PRIORITIES.PAY_PER_USE,
            details: {}
        });

        const bundleSub = await Subscription.create({
            name: 'Data Processing Bundle Plan',
            type: PLAN_TYPES.BUNDLE,
            status: 'active',
            priority: SUBSCRIPTION_PRIORITIES.BUNDLE,
            details: { bundleId: bundle1._id }
        });

        const eventSub = await Subscription.create({
            name: 'Meter Onboarding Event Plan',
            type: PLAN_TYPES.EVENT,
            status: 'active',
            priority: SUBSCRIPTION_PRIORITIES.EVENT,
            details: { eventId: event1._id }
        });

        // Link subscriptions to clients
        await Client.updateOne({ _id: client1._id }, { $addToSet: { subscriptions: payPerUseSub._id } });
        await Client.updateOne({ _id: client2._id }, { $addToSet: { subscriptions: bundleSub._id } });
        await Client.updateOne({ _id: client3._id }, { $addToSet: { subscriptions: eventSub._id } });

        console.log('✅ Demo data seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        mongoose.disconnect();
    }
}

seedData();