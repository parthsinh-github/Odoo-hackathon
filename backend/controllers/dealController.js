const Item = require('../models/Item');
const User = require('../models/User');
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

exports.makeDeal = async (req, res, next) => {
  try {
    const { type, itemId, swapItemId, deliveryInfo, note } = req.body;
    const buyerId = req.user._id;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.status !== 'available') return res.status(400).json({ success: false, message: 'Item is not available' });

    const buyer = await User.findById(buyerId);
    if (!buyer) return res.status(404).json({ success: false, message: 'Buyer not found' });

    const sellerId = item.owner;
    const transactionId = `ORD-${uuidv4()}`;

    if (type === 'redeem') {
      if (buyer.points < item.pointsWorth) {
        return res.status(400).json({ success: false, message: 'Not enough points' });
      }

      buyer.points -= item.pointsWorth;
      item.buyer = buyerId;
      item.status = 'swapped';
      item.swapCount += 1;

      await buyer.save();
      await item.save();

      const order = await Order.create({
        type,
        buyer: buyerId,
        seller: sellerId,
        item: itemId,
        redeemPoints: item.pointsWorth,
        transactionId,
        deliveryInfo,
        note,
        status: 'completed',
        completedAt: new Date(),
      });

      return res.status(200).json({
        success: true,
        message: 'Item redeemed successfully',
        order,
        item
      });

    } else if (type === 'swapped') {
      if (!swapItemId) {
        return res.status(400).json({ success: false, message: 'Swap item ID required' });
      }

      const swapItem = await Item.findById(swapItemId);
      if (!swapItem) return res.status(404).json({ success: false, message: 'Swap item not found' });
      if (swapItem.owner.toString() !== buyerId.toString()) {
        return res.status(403).json({ success: false, message: 'You don’t own the swap item' });
      }
      if (swapItem.status !== 'available') {
        return res.status(400).json({ success: false, message: 'Your swap item is not available' });
      }

      item.buyer = buyerId;
      item.status = 'swapped';
      item.swapCount += 1;

      swapItem.buyer = sellerId;
      swapItem.status = 'swapped';
      swapItem.swapCount += 1;

      await item.save();
      await swapItem.save();

      const order = await Order.create({
        type,
        buyer: buyerId,
        seller: sellerId,
        item: itemId,
        swappedItem: swapItemId,
        transactionId,
        note,
        deliveryInfo,
        status: 'completed',
        completedAt: new Date(),
      });

      return res.status(200).json({
        success: true,
        message: 'Item swapped successfully',
        order,
        swappedWith: {
          yourItem: swapItem,
          receivedItem: item
        }
      });

    } else {
      return res.status(400).json({ success: false, message: 'Invalid deal type' });
    }

  } catch (err) {
    next(err);
  }
};
