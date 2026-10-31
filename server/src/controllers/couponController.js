import Coupon from '../models/Coupon.js';

// @desc    Validate a promo coupon
// @route   POST /api/coupons/validate
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code.' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired promotional code.',
      });
    }

    if (new Date() > coupon.validUntil) {
      return res.status(400).json({
        success: false,
        message: 'This promotional code has expired.',
      });
    }

    if (cartTotal && cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum spend of ₹${coupon.minOrderAmount.toLocaleString('en-IN')}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Privilege code applied successfully.',
      coupon: {
        id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
      },
    });
  } catch (error) {
    next(error);
  }
};
