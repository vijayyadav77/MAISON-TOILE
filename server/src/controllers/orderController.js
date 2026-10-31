import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// @desc    Create a new order from cart or buy now
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }

    if (!shippingAddress || !shippingAddress.recipientName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Valid shipping address is required.' });
    }

    // Verify each item's live price and stock from database
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name || item.productId} is no longer available.`,
        });
      }

      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.totalStock}`,
        });
      }

      const itemPrice = product.discountPrice ? product.discountPrice : product.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: product.images[0] || '',
        size: item.size || 'One Size',
        color: item.color || 'Standard',
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
      });
    }

    // Free luxury shipping on orders over ₹15,000
    const shippingFee = subtotal >= 15000 ? 0 : 500;
    const taxAmount = Math.round(subtotal * 0.12);

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingFee + taxAmount - discountAmount);

    // Unique Luxury Order Number
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ME-${new Date().getFullYear()}-${randomDigits}`;

    const order = await Order.create({
      orderNumber,
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingFee,
      taxAmount,
      discountAmount,
      totalAmount,
      currency: 'INR',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      timeline: [
        {
          status: 'Created',
          timestamp: new Date(),
          note: 'Order initiated, awaiting payment verification',
        },
      ],
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images brand slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or Order Number
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('user', 'name email phone');
    } else {
      order = await Order.findOne({ orderNumber: id }).populate('user', 'name email phone');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Enforce authorization
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an order that has already shipped or delivered.',
      });
    }

    order.orderStatus = 'cancelled';
    order.timeline.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: 'Order cancelled by customer',
    });

    await order.save();

    // Restock items if was already verified
    if (order.paymentStatus === 'paid') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { totalStock: item.quantity },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order successfully cancelled.',
      order,
    });
  } catch (error) {
    next(error);
  }
};
