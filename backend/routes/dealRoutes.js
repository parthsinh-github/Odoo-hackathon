const express = require('express');
const router = express.Router();
const { makeDeal } = require('../controllers/dealController');
const auth= require('../middlewares/authMiddleware');

// Make a deal (redeem or swap)
router.post('/', auth.protect, makeDeal);

module.exports = router;
