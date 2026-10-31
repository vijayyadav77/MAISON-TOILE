import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// Calculate detailed cart summary
const calculateCartTotals = (items, coupon = null) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Luxury standard: Free shipping above INR 15,000, otherwise INR 500
  const shippingFee = subtotal >= 15000 || subtotal === 0 ? 0 : 500;
  
  // Luxury goods GST / Sales Tax approx 12%
  const taxAmount = Math.round(subtotal * 0.12);

  let discountAmount = 0;
  if (coupon && coupon.isActive) {
    if (subtotal >= coupon.minOrderAmount) {
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

  return {
    subtotal,
    shippingFee,
    taxAmount,
    discountAmount,
    totalAmount,
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product')
      .populate('appliedCoupon');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Filter out items whose product might have been deleted
    const validItems = cart.items.filter(item => item.product != null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const totals = calculateCartTotals(cart.items, cart.appliedCoupon);

    res.status(200).json({
      success: true,
      cart: {
        id: cart._id,
        items: cart.items,
        appliedCoupon: cart.appliedCoupon,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
export const addToCart = async (req, res, next) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify stock availability
    if (product.totalStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.totalStock} units available in stock.`,
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Determine price (discount price if active, else regular price)
    const effectivePrice = product.discountPrice ? product.discountPrice : product.price;

    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      const newQuantity = cart.items[existingIndex].quantity + quantity;
      if (newQuantity > product.totalStock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than ${product.totalStock} units to cart.`,
        });
      }
      cart.items[existingIndex].quantity = newQuantity;
      cart.items[existingIndex].price = effectivePrice;
    } else {
      cart.items.push({
        product: productId,
        size,
        color,
        quantity,
        price: effectivePrice,
      });
    }

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/items/:itemId
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    const product = await Product.findById(item.product);
    if (product && quantity > product.totalStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.totalStock} units available in stock.`,
      });
    }

    item.quantity = quantity;
    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      cart.appliedCoupon = null;
      await cart.save();
    }
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Sync local guest cart into user cart on login
// @route   POST /api/cart/sync
export const syncCart = async (req, res, next) => {
  try {
    const { localItems } = req.body;
    if (!Array.isArray(localItems) || localItems.length === 0) {
      return getCart(req, res, next);
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    for (const localItem of localItems) {
      const product = await Product.findById(localItem.productId || localItem.product);
      if (product) {
        const effectivePrice = product.discountPrice || product.price;
        const existing = cart.items.find(
          item =>
            item.product.toString() === product._id.toString() &&
            item.size === localItem.size &&
            item.color === localItem.color
        );

        if (existing) {
          existing.quantity = Math.min(product.totalStock, existing.quantity + (localItem.quantity || 1));
          existing.price = effectivePrice;
        } else {
          cart.items.push({
            product: product._id,
            size: localItem.size,
            color: localItem.color,
            quantity: Math.min(product.totalStock, localItem.quantity || 1),
            price: effectivePrice,
          });
        }
      }
    }

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};
