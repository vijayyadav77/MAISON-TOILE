import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/reviews/product/:productId
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await Review.create({
      user: req.user.id,
      userName: req.user.name,
      product: productId,
      rating: Number(rating),
      title: title || '',
      comment,
      verifiedPurchase: true,
    });

    // Re-aggregate product ratings
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    product.ratingAverage = Number(avgRating.toFixed(1));
    product.ratingCount = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      review,
      productRating: {
        ratingAverage: product.ratingAverage,
        ratingCount: product.ratingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
