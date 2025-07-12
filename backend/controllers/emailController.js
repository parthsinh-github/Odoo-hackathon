const sendEmail = require('../utils/email');
const User = require('../models/User');
const Otp = require('../models/Otp');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    const lowercaseEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: lowercaseEmail });
    if (existingUser?.isVerified) {
      return res.status(409).json({ success: false, message: 'Email already registered and verified' });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await Otp.findOneAndUpdate(
      { email: lowercaseEmail },
      { otp, expires },
      { upsert: true, new: true }
    );

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><style>
        body { font-family: Arial; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; background: white; margin: 20px auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
        .otp-box { background: #00695C; color: white; padding: 10px 20px; font-size: 24px; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { font-size: 12px; color: #888; text-align: center; margin-top: 20px; }
      </style></head>
      <body>
        <div class="container">
          <div style="text-align:center;">
            <img src="cid:reWear-logo" alt="ReWear" style="max-width: 150px;" />
            <h1 style="color:#00695C;">Your ReWear OTP</h1>
          </div>
          <p>Hi there,</p>
          <p>Your OTP is below. It is valid for 10 minutes:</p>
          <div class="otp-box">${otp}</div>
          <p>If you didn’t request this, ignore this email or contact support.</p>
          <div class="footer">&copy; 2025 ReWear. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(lowercaseEmail, 'Your ReWear OTP', html, [
      {
        filename: 'reWear-logo.png',
        path: 'src/assets/reWear-logo.png',
        cid: 'reWear-logo'
      }
    ]);

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, otp } = req.body;
    const lowercaseEmail = email.toLowerCase();

    const otpRecord = await Otp.findOne({ email: lowercaseEmail });

    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    await Otp.deleteOne({ email: lowercaseEmail });
    await User.findOneAndUpdate({ email: lowercaseEmail }, { isVerified: true });

    res.status(200).json({ success: true, message: 'OTP verified successfully', email: lowercaseEmail });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    const lowercaseEmail = email.toLowerCase();

    const user = await User.findOne({ email: lowercaseEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><style>
        body { font-family: Arial; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; background: white; margin: 20px auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
        .button { background: #00695C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { font-size: 12px; color: #888; text-align: center; margin-top: 20px; }
      </style></head>
      <body>
        <div class="container">
          <div style="text-align:center;">
            <img src="cid:reWear-logo" alt="ReWear" style="max-width: 150px;" />
            <h2>Password Reset Request</h2>
          </div>
          <p>Hello ${user.firstName || 'user'},</p>
          <p>Click the button below to reset your ReWear password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>This link expires in 15 minutes.</p>
          <div class="footer">&copy; 2025 ReWear. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(lowercaseEmail, 'Reset Your ReWear Password', html, [
      {
        filename: 'reWear-logo.png',
        path: 'src/assets/reWear-logo.png',
        cid: 'reWear-logo'
      }
    ]);

    res.status(200).json({ success: true, message: 'Reset password email sent' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};
