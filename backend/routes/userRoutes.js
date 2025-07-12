/**
 * User Routes for authentication, profile management, and email verification.
 */
const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');

const router = express.Router();

// ✅ Register
router.post('/register', validate.validateRegister, userController.registerUser);

// ✅ Login
router.post('/login', validate.validateLogin, userController.loginUser);

// ✅ Get Profile (Protected)
router.get('/profile', protect, userController.getProfile);

// ✅ Update Profile (Protected)
router.put('/profile', protect, validate.validateUpdateProfile, userController.updateProfile);

// 🚀 Future Routes (Optional)
// router.post('/send-otp', validate.validateSendOtp, otpController.sendOtp);
// router.post('/verify-otp', validate.validateVerifyOtp, otpController.verifyOtp);
// router.post('/forgot-password', validate.validateForgotPassword, authController.forgotPassword);
// router.post('/reset-password', validate.validateResetPassword, authController.resetPassword);

module.exports = router;
