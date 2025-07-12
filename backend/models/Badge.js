const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String, // URL or static path to badge icon
    },
    description: {
      type: String,
      trim: true,
    },
    requiredPoints: {
      type: Number,
      required: true,
      min: 0,
    },
    level: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
    },
    reward: {
      type: String, // e.g., discount, free swap, coupon
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Badge', badgeSchema);
