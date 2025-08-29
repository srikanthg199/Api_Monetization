const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validationMiddleware');
const { assignSubscriptionSchema } = require('../validation/schemas');
const subscriptionController = require('../controller/subscriptionController');

router.post('/subscribe', validateRequest(assignSubscriptionSchema), subscriptionController.create);

router.get("/", subscriptionController.getSubscriptions)

module.exports = router;