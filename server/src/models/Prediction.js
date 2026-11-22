const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be anonymous or null for now
    },
    originalText: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        default: 'text-input'
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    isExposed: {
        type: Boolean, // True if score > threshold
        required: true
    },
    analysis: [{
        type: String // Array of strings explaining why
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
