const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // Handles file uploads

// Middleware to dynamically set upload subfolder (e.g., /uploads/badge/)
const badgeUploader = (req, res, next) => {
  req.uploadFolder = 'badge';
  next();
};

// 👑 Admin: Create badge
router.post(
  '/',
  protect,
  adminOnly,
  badgeUploader,
  upload.single('icon'), // 'icon' must match frontend input name
  badgeController.createBadge
);

// 📜 Public/Admin: Get all badges
router.get('/', badgeController.getAllBadges);

// 📎 Public/Admin: Get single badge by ID
router.get('/:id', badgeController.getBadgeById);

// 🛠️ Admin: Update badge
router.put(
  '/:id',
  protect,
  adminOnly,
  badgeUploader,
  upload.single('icon'),
  badgeController.updateBadge
);

// ❌ Admin: Delete badge
router.delete('/:id', protect, adminOnly, badgeController.deleteBadge);

// 🔁 Assign badge to user based on points (auto)
router.post('/assign', protect, badgeController.assignBadgeToUser);

module.exports = router;
