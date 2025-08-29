const express = require('express');
const router = express.Router();
const billingMiddleware = require('../middleware/billingMiddleware');
const { getDataPaidApiData, getApis, } = require('../controller/apiController');


// Sample API endpoints (simulate usage)
router.get("/", getApis);

router.get('/getData', billingMiddleware, getDataPaidApiData);

router.get('/getData_2', billingMiddleware, getDataPaidApiData);

router.get('/getData_base', billingMiddleware, getDataPaidApiData);

module.exports = router;