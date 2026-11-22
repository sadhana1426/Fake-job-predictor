const nodemailer = require('nodemailer');

// Use environment variables for credentials
// In production, use SendGrid or AWS SES
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'hotmail', 'yahoo' etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendOTP = async (email, otp) => {
    const message = {
        from: `Fake Job Detector <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4F46E5;">Verify your account</h2>
                <p>Hello,</p>
                <p>Your verification code for Fake Job Detector is:</p>
                <h1 style="background: #f3f4f6; padding: 10px; display: inline-block; border-radius: 8px;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(message);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

exports.sendWelcome = async (email, name) => {
    const message = {
        from: `Fake Job Detector <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Fake Job Detector!',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #10B981;">Welcome, ${name}!</h2>
                <p>Thank you for signing up. You can now access our advanced fake job detection tools.</p>
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
            </div>
        `,
    };

    try {
        await transporter.sendMail(message);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};
