import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with search, filters, sorting & pagination
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      subCategory,
      brand,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      featured,
      newArrival,
      trending,
    } = req.query;

    const query = {};

    // Keyword search across name, brand, description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter (support category slug or ID)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    if (subCategory) {
      query.subCategory = { $regex: subCategory, $options: 'i' };
    }

    // Brand filter (supports comma-separated list)
    if (brand) {
      const brands = brand.split(',').map(b => b.trim());
      query.brand = { $in: brands.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // Size filter
    if (size) {
      const sizes = size.split(',').map(s => s.trim());
      query.sizes = { $in: sizes };
    }

    // Color filter
    if (color) {
      const colors = color.split(',').map(c => c.trim());
      query['colors.name'] = { $in: colors.map(c => new RegExp(`^${c}$`, 'i')) };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Editorial flags
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (trending === 'true') query.isTrending = true;

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'rating') {
      sortOptions = { ratingAverage: -1 };
    } else if (sort === 'popular') {
      sortOptions = { ratingCount: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:identifier
export const getProductByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug description');
    } else {
      product = await Product.findOne({ slug: identifier }).populate('category', 'name slug description');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
export const getRelatedProducts = async (req, res, next) => {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: current._id },
      $or: [
        { category: current.category },
        { brand: current.brand },
      ],
    })
      .populate('category', 'name slug')
      .limit(4);

    res.status(200).json({
      success: true,
      products: related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct filter facets (brands, sizes, colors, price range)
// @route   GET /api/products/facets/all
export const getProductFacets = async (req, res, next) => {
  try {
    const [brands, categories, minMaxPrice] = await Promise.all([
      Product.distinct('brand'),
      Category.find({}, 'name slug image'),
      Product.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]),
    ]);

    const standardSizes = ['XS', 'S', 'M', 'L', 'XL'];
    const standardColors = ['Noir', 'Blanc', 'Camel', 'Crème', 'Bordeaux', 'Olive', 'Gold'];

    res.status(200).json({
      success: true,
      facets: {
        brands: brands.sort(),
        categories,
        sizes: standardSizes,
        colors: standardColors,
        priceRange: {
          min: minMaxPrice[0]?.minPrice || 0,
          max: minMaxPrice[0]?.maxPrice || 100000,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
