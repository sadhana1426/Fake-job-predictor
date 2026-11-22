const Prediction = require('../models/Prediction');
const User = require('../models/User');

// @desc    Get all predictions (Admin)
// @route   GET /api/admin/predictions
// @access  Private/Admin
exports.getAllPredictions = async (req, res, next) => {
    try {
        const predictions = await Prediction.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: predictions.length,
            data: predictions,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getSystemStats = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments();
        const predictionCount = await Prediction.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                users: userCount,
                predictions: predictionCount,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
