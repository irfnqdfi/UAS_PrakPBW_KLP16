const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(authenticate);
const { calculate } = require('../controllers/calculator.controller');
router.post('/', calculate);
module.exports = router;
