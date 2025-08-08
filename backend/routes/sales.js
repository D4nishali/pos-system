const express = require('express');
const { createSale, getSales, getSaleDetails } = require('../controllers/salesController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, createSale);
router.get('/', authenticate, getSales);
router.get('/:id', authenticate, getSaleDetails);

module.exports = router;