const express = require('express');
const { Router } = express;
const router = Router();
const userrouter = require('./user');
const startuprouter = require('./startups');
const investmentrouter = require('./investments');
const patentrouter = require('./patent');


router.use('/api/user', userrouter);
router.use('/api/startup', startuprouter);
router.use('/api/investment', investmentrouter);
router.use('/api/patent', patentrouter);

module.exports = router;