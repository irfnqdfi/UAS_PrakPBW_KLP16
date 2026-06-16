const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getAll, getOne, create, update, remove } = require('../controllers/measurement.controller');
const router = express.Router();

router.use(authenticate);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
