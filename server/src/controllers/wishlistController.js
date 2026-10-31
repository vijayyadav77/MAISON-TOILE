import Wishlist from '../models/Wishlist.js';

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      products: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

    res.status(200).json({
      success: true,
      message: 'Item added to your luxury wishlist.',
      count: wishlist.products.length,
      products: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        id => id.toString() !== productId
      );
      await wishlist.save();
    }

    wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

    res.status(200).json({
      success: true,
      message: 'Item removed from your wishlist.',
      count: wishlist ? wishlist.products.length : 0,
      products: wishlist ? wishlist.products : [],
    });
  } catch (error) {
    next(error);
  }
};
