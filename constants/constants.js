module.exports = {
    // === CORE PRICING CONFIGURATION ===
    PRICING: {
        // Default price per call for APIs
        DEFAULT_PRICE_PER_CALL: 0.01,
        // Bundle pricing
        BUNDLE_BASE_PRICE: 0.05,
        BUNDLE_THRESHOLD: 100000,        // Usage threshold for discounts
        BUNDLE_DISCOUNT_PERCENTAGE: 0.1, // 10% discount after threshold
        // Event pricing
        EVENT_FIXED_PRICE: 1.00,
    },

    // === SUBSCRIPTION PRIORITIES ===
    // Higher priority wins when resolving which plan to use
    SUBSCRIPTION_PRIORITIES: {
        PAY_PER_USE: 1,
        BUNDLE: 2,
        EVENT: 3,
    },

    // === RATE LIMITING CONFIGURATION ===
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100,
        MESSAGE: {
            success: false,
            message: "Too many requests from this IP, please try again later.",
        },
    },

    // === PLAN TYPES (keep as constants for consistency) ===
    PLAN_TYPES: {
        PAY_PER_USE: 'payPerUse',
        BUNDLE: 'bundle',
        EVENT: 'event',
    },
};