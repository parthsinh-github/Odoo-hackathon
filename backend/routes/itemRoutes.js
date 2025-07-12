const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// ==============================
//         PUBLIC ROUTES
// ==============================

// Get all items with optional ?approval=pending|approved|rejected
router.get('/', itemController.getAllItems);

// Get single item by ID
router.get('/:id', itemController.getItemById);

// ==============================
//        CLIENT ROUTES
// ==============================

// Create a new item
router.post(
  '/',
  protect,
  (req, res, next) => {
    req.uploadFolder = 'items';
    next();
  },
  upload.array('images'),
  itemController.createItem
);

// Update item (only by owner)
router.put(
  '/:id',
  protect,
  (req, res, next) => {
    req.uploadFolder = 'items';
    next();
  },
  upload.array('images'),
  itemController.updateItem
);

// Delete item (only by owner)
router.delete('/:id', protect, itemController.deleteItem);

// ==============================
//         ADMIN ROUTES
// ==============================

// Approve or Reject an item (admin only)
router.patch(
  '/:id/approval',
  protect,
  adminOnly,
  itemController.approveOrRejectItem
);

module.exports = router;
