const Badge = require('../models/Badge');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const path = require('path');

// 🎯 Admin: Create a new badge
exports.createBadge = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    requiredPoints,
    level,
    reward,
    isActive = true,
  } = req.body;

  const existing = await Badge.findOne({ name });
  if (existing) {
    res.status(400);
    throw new Error('Badge with this name already exists');
  }

  const iconPath = req.file ? `/uploads/badge/${req.file.filename}` : null;

  const badge = await Badge.create({
    name,
    description,
    requiredPoints,
    icon: iconPath,
    level,
    reward,
    isActive,
  });

  res.status(201).json({ success: true, badge });
});

// 📜 Admin: Get all badges
exports.getAllBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.find().populate('users', 'firstName lastName email');
  res.status(200).json({ success: true, badges });
});

// 📎 Admin: Get badge by ID
exports.getBadgeById = asyncHandler(async (req, res) => {
  const badge = await Badge.findById(req.params.id).populate('users', 'firstName lastName email');
  if (!badge) {
    res.status(404);
    throw new Error('Badge not found');
  }
  res.status(200).json({ success: true, badge });
});

// ✏️ Admin: Update badge
exports.updateBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findById(req.params.id);
  if (!badge) {
    res.status(404);
    throw new Error('Badge not found');
  }

  const {
    name,
    description,
    requiredPoints,
    level,
    reward,
    isActive,
  } = req.body;

  const iconPath = req.file ? `/uploads/badge/${req.file.filename}` : badge.icon;

  badge.name = name || badge.name;
  badge.description = description || badge.description;
  badge.requiredPoints = requiredPoints ?? badge.requiredPoints;
  badge.level = level || badge.level;
  badge.reward = reward || badge.reward;
  badge.icon = iconPath;
  badge.isActive = isActive ?? badge.isActive;

  await badge.save();

  res.status(200).json({ success: true, badge });
});

// ❌ Admin: Delete badge
exports.deleteBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findById(req.params.id);
  if (!badge) {
    res.status(404);
    throw new Error('Badge not found');
  }

  await badge.deleteOne();
  res.status(200).json({ success: true, message: 'Badge deleted successfully' });
});

// 🧠 Client/Admin: Assign applicable badges to a user based on points
exports.assignBadgeToUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const eligibleBadges = await Badge.find({
    requiredPoints: { $lte: user.points },
    isActive: true,
  });

  let assignedCount = 0;
  for (const badge of eligibleBadges) {
    if (!badge.users.includes(user._id)) {
      badge.users.push(user._id);
      await badge.save();
      assignedCount++;
    }

    // Update user's current badge to the highest point-eligible one
    if (!user.badge || badge.requiredPoints > (user.badge?.requiredPoints || 0)) {
      user.badge = badge._id;
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: assignedCount
      ? `Assigned ${assignedCount} badge(s) to user`
      : 'No new badges assigned',
  });
});
