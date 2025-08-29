const Client = require('../models/Client');
const Bundle = require('../models/Bundle');
const Event = require('../models/Event');
const Usage = require('../models/Usage');
const API = require('../models/API');
const { PLAN_TYPES } = require('../constants/constants');

async function billingMiddleware (req, res, next) {
    try {
        const { clientId } = req.body;
        if (!clientId) {
            return res.status(400).json({
                error: "Client ID required in header (client-id) or body (clientId)",
            });
        }
        const fullEndpoint = req.baseUrl + req.route.path; // e.g. /api/getData
        // Run both queries in parallel
        const [client, APIDetails] = await Promise.all([
            Client.findById(clientId).populate("subscriptions"),
            API.findOne({ endpoint: fullEndpoint }),
        ]);
        // Validate client
        if (!client || !client.subscriptions.length) {
            return res.status(404).json({
                error: "No subscriptions found for this client",
            });
        }
        // Validate API details
        if (!APIDetails) {
            return res.status(404).json({ error: "API not registered" });
        }
        // Sort subscriptions by priority (desc)
        const activeSubs = client.subscriptions
            .filter((s) => s.status === "active")
            .sort((a, b) => b.priority - a.priority);

        if (!activeSubs.length) {
            return res.status(403).json({
                error: "No active subscription available",
            });
        }
        let pricing = null;
        // Iterate through subscriptions in priority order until match is found
        for (const sub of activeSubs) {
            switch (sub.type) {
                case PLAN_TYPES.BUNDLE: {
                    const bundle = await Bundle.findById(sub.details.bundleId);
                    if (
                        bundle &&
                        bundle.apiIds.map(String).includes(String(APIDetails._id))
                    ) {
                        pricing = {
                            planType: PLAN_TYPES.BUNDLE,
                            subscriptionId: sub._id,
                            price: bundle.basePrice,
                            eventId: null,
                        };
                    }
                    break;
                }

                case PLAN_TYPES.EVENT: {
                    const event = await Event.findById(sub.details.eventId);
                    if (
                        event &&
                        event.apiIds.map(String).includes(String(APIDetails._id))
                    ) {
                        pricing = {
                            planType: PLAN_TYPES.EVENT,
                            subscriptionId: sub._id,
                            price: event.fixedPrice,
                            eventId: event._id,
                        };
                    }
                    break;
                }

                case PLAN_TYPES.PAY_PER_USE: {
                    pricing = {
                        planType: PLAN_TYPES.PAY_PER_USE,
                        subscriptionId: sub._id,
                        price: APIDetails.pricePerCall,
                        eventId: null,
                    };
                    break;
                }
            }

            // ✅ if pricing found, stop looking further
            if (pricing) break;
        }

        if (!pricing) {
            return res
                .status(403)
                .json({ status: false, error: "API not allowed under current subscriptions" });
        }

        // 5. Log usage in Usage collection
        await Usage.create({
            clientId,
            apiId: APIDetails._id,
            eventId: pricing.eventId || null,
            cost: pricing.price,
            planType: pricing.planType,
            subscriptionId: pricing.subscriptionId,
        });

        // Attach pricing to request for controller use
        req.pricing = pricing;
        next();
    } catch (error) {
        console.error("Usage tracker error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = billingMiddleware;
