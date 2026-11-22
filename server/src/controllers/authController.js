const User = require('../models/User');
const Joi = require('joi');
const { sendOTP, sendWelcome } = require('../services/emailService');
const crypto = require('crypto');

// @desc      Register user & Send OTP
// @route     POST /api/auth/register
// @access    Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        const user = await User.create({
            name,
            email,
            password,
            otpCode,
            otpExpires,
            isVerified: false
        });

        // Send OTP Email
        try {
            await sendOTP(email, otpCode);
        } catch (emailError) {
            // If email fails, we might want to delete the user or allow resend. 
            // For now, just log it.
            console.error("Failed to send OTP", emailError);
        }

        res.status(200).json({
            success: true,
            data: { email: user.email },
            message: 'OTP sent to email. Please verify.'
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc      Verify OTP
// @route     POST /api/auth/verify
// @access    Public
exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email }).select('+otpCode +otpExpires');

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid email' });
        }

        if (user.isVerified) {
            return res.status(200).json({ success: true, message: 'Already verified' });
        }

        if (user.otpCode !== otp) {
            return res.status(400).json({ success: false, error: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, error: 'OTP expired' });
        }

        // Verify User
        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Send Welcome Email
        await sendWelcome(user.email, user.name);

        sendTokenResponse(user, 200, res);

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(401).json({ success: false, error: 'Account not verified. Please verify your email.' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc      Get current logged in user
// @route     GET /api/auth/me
// @access    Private
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        }
    });
};
