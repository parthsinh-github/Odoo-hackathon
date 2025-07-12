const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      enum: ["men", "women", "kids", "accessories", "others"],
      required: true,
    },

    condition: {
      type: String,
      enum: [
        "brand new",
        "like new",
        "gently used",
        "used",
        "well used",
        "worn",
        "refurbished",
        "damaged but usable",
      ],
      required: true,
    },

    size: {
      type: String,
      enum: [
        "XS", "S", "M", "L", "XL", "XXL",
        "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y",
        "28", "30", "32", "34", "36", "38", "40",
        "Free Size"
      ],
    },

    tags: [String], // for search filtering

    images: [String], // array of URLs or file paths

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    location: {
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },

    status: {
      type: String,
      enum: ["available", "swapped", "reserved"],
      default: "available",
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    pointsWorth: {
      type: Number,
      default: 10,
    },

    swapCount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    expirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
