const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['redeem', 'swapped'],
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },

    // Only for 'swapped'
    swappedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null,
    },

    // Only for 'redeem'
    redeemPoints: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },

    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    deliveryInfo: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    note: {
      type: String,
      trim: true,
    },

    isRated: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
