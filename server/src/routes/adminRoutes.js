const express = require('express');
const { getAllPredictions, getSystemStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/predictions', getAllPredictions);
router.get('/stats', getSystemStats);

module.exports = router;
