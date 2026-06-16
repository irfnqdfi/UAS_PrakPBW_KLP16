const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(authenticate);
const { updateProfile, changePassword } = require('../controllers/profile.controller');
router.put('/', updateProfile); router.put('/password', changePassword);
module.exports = router;
