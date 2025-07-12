/**
 * Routes for email-related operations.
 */
const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} = require('../controllers/emailController');
const {
  validateSendOtp,
  validateVerifyOtp,
  validateForgotPassword,
  validateResetPassword,
} = require('../middlewares/validate');

router.post('/send-otp', validateSendOtp, sendOtp);
router.post('/verify-otp', validateVerifyOtp, verifyOtp);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;