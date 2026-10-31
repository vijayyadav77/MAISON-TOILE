import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { reviewService } from '../services/reviewService.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

export const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-luxury-100 text-xs text-luxury-700 text-center font-sans">
        Please sign in to write an editorial review for this piece.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide your review feedback.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await reviewService.createReview(productId, {
        rating,
        title,
        comment,
      });
      setSuccess('Your review has been published to the salon.');
      setTitle('');
      setComment('');
      if (onReviewAdded) onReviewAdded(data.review, data.productRating);
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white border border-luxury-200 shadow-sm">
      <h4 className="font-serif text-lg text-luxury-950 font-medium">
        Share Your Critique
      </h4>

      {error && <p className="text-xs text-rose-600">{error}</p>}
      {success && <p className="text-xs text-emerald-700">{success}</p>}

      {/* Star Selector */}
      <div className="space-y-1">
        <label className="block text-[11px] uppercase tracking-wider text-luxury-700 font-medium">
          Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  (hoverRating || rating) >= star
                    ? 'fill-luxury-gold text-luxury-gold'
                    : 'text-luxury-200'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-xs text-luxury-600 font-medium font-sans">
            {rating} of 5 Stars
          </span>
        </div>
      </div>

      <Input
        label="Review Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Impeccable craftsmanship and silhouette"
      />

      <div className="space-y-1">
        <label className="block text-[11px] uppercase tracking-wider text-luxury-700 font-medium">
          Detailed Comments *
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Describe the fabric weight, fit, and styling experience..."
          className="w-full px-4 py-3 bg-white border border-luxury-200 text-sm text-luxury-900 focus:outline-none focus:border-luxury-900 placeholder:text-luxury-400"
        />
      </div>

      <Button type="submit" isLoading={loading} size="sm">
        Publish Review
      </Button>
    </form>
  );
};

export default ReviewForm;
