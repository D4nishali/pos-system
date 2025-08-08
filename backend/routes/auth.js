const express = require('express');
const { login, register } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', authenticate, register);

module.exports = router;