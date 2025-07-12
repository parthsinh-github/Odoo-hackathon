/**
 * OTP schema for MongoDB to store OTPs persistently and auto-expire them.
 */
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ TTL Index to auto-delete after 'expires' time
otpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
