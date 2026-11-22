const express = require('express');
const { analyzeJob, getHistory } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temp storage

const router = express.Router();

router.post('/analyze', upload.single('file'), analyzeJob);
router.get('/history', protect, getHistory);

module.exports = router;
