import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../../utils/formatDate.js';

export const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center text-luxury-500 font-sans text-xs">
        Be the first connoisseur to review this couture piece.
      </div>
    );
  }

  return (
    <div className="space-y-6 divide-y divide-luxury-200">
      {reviews.map((rev) => (
        <div key={rev._id} className="pt-6 first:pt-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-luxury-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rev.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-luxury-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-luxury-400 font-sans">
              {formatDate(rev.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h4 className="font-serif text-sm font-semibold text-luxury-950">
              {rev.title || 'Client Review'}
            </h4>
            {rev.verifiedPurchase && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase tracking-widest font-medium">
                <ShieldCheck className="w-3 h-3" />
                Verified Acquisition
              </span>
            )}
          </div>

          <p className="text-xs text-luxury-700 leading-relaxed font-sans">
            {rev.comment}
          </p>

          <p className="text-[10px] uppercase tracking-widest text-luxury-400 font-medium">
            Reviewed by {rev.userName || 'Client'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
