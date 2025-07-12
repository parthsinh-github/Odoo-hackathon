const { body } = require('express-validator');

exports.validateSendOtp = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
];

exports.validateVerifyOtp = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

exports.validateForgotPassword = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
];

exports.validateResetPassword = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

exports.validateRegister = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('referralCode')
    .optional()
    .isString()
    .withMessage('Referral code must be a string'),
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.validateUpdateProfile = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('preferredSizes')
    .optional()
    .isArray()
    .withMessage('Preferred sizes must be an array (e.g. ["M", "L"])'),
];
