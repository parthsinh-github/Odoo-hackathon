const Item = require('../models/Item');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// 🔹 Create item
exports.createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      size,
      pointsWorth,
      tags,
      location,
      expirationDate,
      isFeatured,
    } = req.body;

    const owner = req.user._id;
    const images = req.files?.map(file => `/uploads/items/${file.filename}`) || [];

    const item = new Item({
      title,
      description,
      category,
      condition,
      size,
      pointsWorth,
      tags,
      location,
      expirationDate,
      isFeatured,
      owner,
      images,
    });

    await item.save();

    res.status(201).json({ success: true, message: 'Item listed successfully', item });
  } catch (err) {
    next(err);
  }
};

// 🔹 Get all items
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find({})
      .populate('owner', 'firstName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

// 🔹 Get item by ID
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner buyer', 'firstName email');

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    res.status(200).json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

// 🔹 Update item
exports.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const images = req.files?.map(file => `/uploads/items/${file.filename}`);

    const updateData = {
      ...req.body,
      ...(images && { images }),
    };

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Item updated', item: updatedItem });
  } catch (err) {
    next(err);
  }
};

// 🔹 Delete item
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await item.remove();

    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

// 🔹 Admin: Approve or Reject item
exports.approveOrRejectItem = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status: must be approved or rejected' });
    }

    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.approvalStatus = status;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Item has been ${status}`,
      item,
    });
  } catch (err) {
    next(err);
  }
};
