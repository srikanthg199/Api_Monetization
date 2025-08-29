const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validationMiddleware');
const { invoiceParamsSchema } = require('../validation/schemas');
const { generateInvoice } = require('../controller/billingController');

// Generate monthly invoice
router.get('/', validateRequest(invoiceParamsSchema), generateInvoice);

module.exports = router;