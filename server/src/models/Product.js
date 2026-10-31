import mongoose from 'mongoose';

const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, default: '#000000' },
  image: { type: String, default: '' },
}, { _id: false });

const VariantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  stockQuantity: { type: Number, required: true, default: 10, min: 0 },
}, { _id: true });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  details: {
    materials: { type: String, default: '100% Virgin Wool / Silk lining' },
    care: { type: String, default: 'Dry clean only by luxury specialist' },
    origin: { type: String, default: 'Made in Italy' },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subCategory: {
    type: String,
    default: 'Clothing',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  discountPrice: {
    type: Number,
    default: null,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    required: [true, 'At least one product image is required'],
    validate: [val => val.length > 0, 'Please add at least one product image'],
  },
  colors: [ColorSchema],
  sizes: {
    type: [String],
    default: ['XS', 'S', 'M', 'L'],
  },
  variants: [VariantSchema],
  totalStock: {
    type: Number,
    default: 50,
    min: 0,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  ratingAverage: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 12,
  },
}, {
  timestamps: true,
});

// Indexes for high performance searching, sorting, and faceted filtering
ProductSchema.index({ name: 'text', brand: 'text', description: 'text' });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ isFeatured: 1, isNewArrival: 1, isTrending: 1 });

export default mongoose.model('Product', ProductSchema);
