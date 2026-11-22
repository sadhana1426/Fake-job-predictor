const Prediction = require('../models/Prediction');
const DetectionService = require('../services/detectionService');
const pdf = require('pdf-parse');
const fs = require('fs');

// @desc    Analyze Job Description
// @route   POST /api/predict/analyze
// @access  Public (or Private)
exports.analyzeJob = async (req, res, next) => {
    try {
        let textToAnalyze = req.body.text || '';

        // Handle File Upload
        if (req.file) {
            if (req.file.mimetype === 'application/pdf') {
                const dataBuffer = fs.readFileSync(req.file.path);
                const data = await pdf(dataBuffer);
                textToAnalyze = data.text;

                // Cleanup temp file
                fs.unlinkSync(req.file.path);
            } else {
                return res.status(400).json({ success: false, error: 'Only PDF supported for now' });
            }
        }

        if (!textToAnalyze || textToAnalyze.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Please provide text or valid file' });
        }

        const userId = req.user ? req.user.id : null;
        const result = await DetectionService.analyzeText(textToAnalyze, userId);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error during analysis' });
    }
};

// @desc    Get History
// @route   GET /api/predict/history
// @access  Private
exports.getHistory = async (req, res, next) => {
    try {
        const history = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
