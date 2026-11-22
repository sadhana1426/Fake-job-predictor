const express = require('express');
const { register, login, getMe, verifyOTP } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyOTP);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
