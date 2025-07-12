const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    phone: {
      type: String,
      trim: true,
    },

    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },

    avatar: {
      type: String, // URL to profile image
    },

    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    preferredSizes: {
      type: [String], // Example: ['M', 'L']
      default: [],
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    swappedItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Swap',
      },
    ],

    points: {
      type: Number,
      default: 0,
    },

    credits: {
      type: Number,
      default: 0,
    },

    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
    },

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    referredBy: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    notifications: [
      {
        message: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    resetToken: {
      type: String,
    },

    resetTokenExpires: {
      type: Date,
    },

    // ✅ Add this sessions field to fix the error
    sessions: [
      {
        device: String,
        ip: String,
        loginAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
