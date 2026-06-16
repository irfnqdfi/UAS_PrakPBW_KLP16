const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(authenticate);
const { getAll, create, update, remove } = require('../controllers/reminder.controller');
router.get('/', getAll); router.post('/', create);
router.put('/:id', update); router.delete('/:id', remove);
module.exports = router;
