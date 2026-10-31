import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get Admin Dashboard KPI metrics
// @route   GET /api/admin/analytics
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [totalProducts, totalUsers, totalOrders, paidOrders, lowStockProducts, recentOrders] =
      await Promise.all([
        Product.countDocuments(),
        User.countDocuments({ role: 'customer' }),
        Order.countDocuments(),
        Order.find({ paymentStatus: 'paid' }),
        Product.find({ totalStock: { $lte: 15 } }).limit(6).select('name brand totalStock images price'),
        Order.find()
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(6),
      ]);

    const totalSales = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Sales by day/status summary
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalSales,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts,
      recentOrders,
      statusCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/admin/products
export const createAdminProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      description,
      category,
      subCategory,
      price,
      discountPrice,
      images,
      colors,
      sizes,
      totalStock,
      isFeatured,
      isNewArrival,
      isTrending,
      materials,
      care,
      origin,
    } = req.body;

    // Generate unique slug
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const discountPercentage = discountPrice && discountPrice < price
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

    const product = await Product.create({
      name,
      slug,
      brand,
      description,
      details: {
        materials: materials || '100% Silk / Virgin Wool',
        care: care || 'Specialist dry clean only',
        origin: origin || 'Made in Italy',
      },
      category,
      subCategory: subCategory || 'Apparel',
      price,
      discountPrice: discountPrice || null,
      discountPercentage,
      images: Array.isArray(images) && images.length ? images : [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200'
      ],
      colors: colors || [{ name: 'Noir', hex: '#000000' }],
      sizes: sizes || ['XS', 'S', 'M', 'L'],
      totalStock: totalStock || 25,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isTrending: Boolean(isTrending),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
export const updateAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };
    if (updates.price && updates.discountPrice) {
      updates.discountPercentage = Math.round(
        ((updates.price - updates.discountPrice) / updates.price) * 100
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
export const deleteAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
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

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    order.timeline.push({
      status: orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1),
      timestamp: new Date(),
      note: note || `Order marked as ${orderStatus} by administration`,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}.`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registered users
// @route   GET /api/admin/users
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
