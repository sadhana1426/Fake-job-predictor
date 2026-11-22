const Prediction = require('../models/Prediction');

const RULE_KEYWORDS = [
    { word: 'telegram', weight: 30, reason: 'Mentions Telegram (often used by scammers)' },
    { word: 'whatsapp', weight: 30, reason: 'Mentions WhatsApp (suspicious for official jobs)' },
    { word: 'no interview', weight: 40, reason: 'Claims "No Interview" required' },
    { word: 'investment', weight: 50, reason: 'Asks for investment or fee' },
    { word: 'weekly pay', weight: 20, reason: 'Unusual "Weekly Pay" structure (common in scams)' },
    { word: '$5000', weight: 20, reason: 'Unrealistically high weekly salary' },
    { word: 'gmail.com', weight: 10, reason: 'Uses generic Gmail instead of company domain' },
    { word: 'typing job', weight: 30, reason: 'Mention of "Typing Job" (high risk category)' },
    { word: 'data entry', weight: 15, reason: 'Generic "Data Entry" without skills (common scam)' }
];

exports.analyzeText = async (text, userId = null) => {
    let score = 0;
    const analysis = [];
    const lowerText = text.toLowerCase();

    // 1. Keyword Analysis
    RULE_KEYWORDS.forEach(rule => {
        if (lowerText.includes(rule.word)) {
            score += rule.weight;
            analysis.push(rule.reason);
        }
    });

    // 2. Length Analysis (Too short is suspicious)
    if (text.length < 50) {
        score += 20;
        analysis.push('Job description is suspiciously short');
    }

    // 3. Grammar/Caps Analysis (Rough heuristic)
    const upperCaseCount = (text.match(/[A-Z]/g) || []).length;
    if (upperCaseCount > text.length * 0.4) {
        score += 20;
        analysis.push('Excessive use of CAPITAL LETTERS');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Create Prediction Record
    const prediction = await Prediction.create({
        userId,
        originalText: text,
        score,
        isExposed: score > 40, // Threshold for "Fake"
        analysis
    });

    return prediction;
};
