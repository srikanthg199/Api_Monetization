const express = require('express');
const router = express.Router();

router.use('/my_api', require('./apiRoutes'));
router.use('/subscriptions', require('./subscriptionRoutes'));
router.use('/billing', require('./billingRoutes'));
router.use('/clients', require('./clientRoutes'));

module.exports = router;