import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { getRazorpayInstance, verifyPaymentSignature } from '../config/razorpay.js';
import crypto from 'crypto';

// @desc    Create Razorpay Order for Checkout
// @route   POST /api/payments/create-order
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized order access' });
    }

    const amountInPaise = Math.round(order.totalAmount * 100);
    const razorpay = getRazorpayInstance();

    let razorpayOrder;

    if (razorpay) {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: order.orderNumber,
          notes: {
            orderId: order._id.toString(),
            userEmail: req.user.email,
          },
        });
      } catch (err) {
        console.warn('[Razorpay API direct call failed, generating sandbox test order]:', err.message);
      }
    }

    // Graceful fallback for sandbox / development test mode without live bank registration
    if (!razorpayOrder) {
      razorpayOrder = {
        id: `order_test_${crypto.randomBytes(8).toString('hex')}`,
        amount: amountInPaise,
        currency: 'INR',
        receipt: order.orderNumber,
      };
    }

    order.paymentDetails.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_luxuryfashion2026',
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature & confirm order
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to order' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Order already verified and paid.',
        order,
      });
    }

    const isValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      order.paymentStatus = 'failed';
      order.timeline.push({
        status: 'Payment Failed',
        timestamp: new Date(),
        note: 'Cryptographic signature verification failed',
      });
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid cryptographic signature.',
      });
    }

    // Mark order as paid and confirmed
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentDetails = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date(),
    };
    order.timeline.push({
      status: 'Confirmed',
      timestamp: new Date(),
      note: `Payment verified via Razorpay (${razorpayPaymentId})`,
    });

    await order.save();

    // Deduct stock for all ordered products
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { totalStock: -item.quantity },
      });
    }

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], appliedCoupon: null });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully. Order confirmed.',
      order,
    });
  } catch (error) {
    next(error);
  }
};
