const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validationMiddleware');
const { createClientSchema, clientIdSchema } = require('../validation/schemas');
const clientController = require('../controller/clientController');

router.get('/', clientController.getAll);
router.post('/', validateRequest(createClientSchema), clientController.create);
router.get('/:id', validateRequest(clientIdSchema), clientController.getById);


module.exports = router;