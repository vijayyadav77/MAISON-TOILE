import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating between 1 and 5 is required'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
    default: '',
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
  },
  verifiedPurchase: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

ReviewSchema.index({ product: 1, createdAt: -1 });

export default mongoose.model('Review', ReviewSchema);
