const express = require('express');
const { Router } = express;
const router = Router();
const userrouter = require('./user');
const startuprouter = require('./startups');
const investmentrouter = require('./investments');


router.use('/api/user', userrouter);
router.use('/api/startup', startuprouter);
router.use('/api/investment', investmentrouter);

module.exports = router;