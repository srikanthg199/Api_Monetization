const Joi = require('joi');

// ObjectId validation pattern
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Client validation schemas
const createClientSchema = Joi.object({
    name: Joi.string().min(2).max(100).trim().required(),
    email: Joi.string().email().lowercase().trim().required()
});

// Subscription validation schemas
const assignSubscriptionSchema = Joi.object({
    clientId: Joi.string().pattern(objectIdPattern).required(),
    subscriptionId: Joi.string().pattern(objectIdPattern).required()
});

// API data validation schemas
const postDataSchema = Joi.object({
    data: Joi.any().required()
}).min(1);

// Parameter validation schemas
const clientIdSchema = Joi.object({
    id: Joi.string().pattern(objectIdPattern).required()
});

const invoiceParamsSchema = Joi.object({
    clientId: Joi.string().pattern(objectIdPattern).required(),
    month: Joi.alternatives()
        .try(
            Joi.string().pattern(/^\d{4}-\d{2}$/),
            Joi.string().pattern(/^\d{1,2}$/)
        )
        .required()
});

const eventIdSchema = Joi.object({
    eventId: Joi.string().pattern(objectIdPattern).required()
});

// Header validation schemas
const clientIdHeaderSchema = Joi.object({
    'client-id': Joi.string().pattern(objectIdPattern).required()
});

module.exports = {
    createClientSchema,
    assignSubscriptionSchema,
    postDataSchema,
    clientIdSchema,
    invoiceParamsSchema,
    eventIdSchema,
    clientIdHeaderSchema
};