const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(authenticate);
const { getAll, getOne, create, update, remove } = require('../controllers/workout.controller');
router.get('/', getAll); router.get('/:id', getOne);
router.post('/', create); router.put('/:id', update); router.delete('/:id', remove);
module.exports = router;
