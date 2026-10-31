import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Ruler,
} from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Button from '../../../components/ui/Button.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import ProductImageGallery from '../components/ProductImageGallery.jsx';
import SizeGuideModal from '../components/SizeGuideModal.jsx';
import ReviewList from '../../reviews/components/ReviewList.jsx';
import ReviewForm from '../../reviews/components/ReviewForm.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { productService } from '../services/productService.js';
import { reviewService } from '../../reviews/services/reviewService.js';
import { addItemToCart } from '../../cart/cartSlice.js';
import { toggleWishlistItem } from '../../wishlist/wishlistSlice.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const ProductDetailsPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Accordion toggle states
  const [openAccordions, setOpenAccordions] = useState({
    materials: true,
    origin: false,
    shipping: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = product && wishlistItems.some(
    (item) => (item._id || item.id) === (product._id || product.id)
  );

  useDocumentTitle(product ? product.name : 'Loading Couture Piece...');

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const data = await productService.getProductDetails(identifier);
        setProduct(data.product);

        if (data.product.sizes?.length > 0) {
          setSelectedSize(data.product.sizes[0]);
        }
        if (data.product.colors?.length > 0) {
          setSelectedColor(data.product.colors[0].name);
        }

        // Fetch related products & reviews in parallel
        const [relatedRes, reviewsRes] = await Promise.all([
          productService.getRelatedProducts(data.product._id).catch(() => ({ products: [] })),
          reviewService.getProductReviews(data.product._id).catch(() => ({ reviews: [] })),
        ]);

        setRelatedProducts(relatedRes.products || []);
        setReviews(reviewsRes.reviews || []);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [identifier]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-luxury-200" />
          <div className="space-y-4">
            <div className="h-4 w-1/4 bg-luxury-200" />
            <div className="h-8 w-3/4 bg-luxury-200" />
            <div className="h-6 w-1/3 bg-luxury-200" />
            <div className="h-32 bg-luxury-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl text-luxury-950 font-normal">Piece Not Found</h2>
        <p className="text-xs text-luxury-600">The requested runway design is no longer available in our salon catalogue.</p>
        <Button onClick={() => navigate('/shop')}>Return to Catalogue</Button>
      </div>
    );
  }

  const effectivePrice = product.discountPrice || product.price;

  const handleAddToCart = async () => {
    await dispatch(
      addItemToCart({
        productId: product._id,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        price: effectivePrice,
        size: selectedSize || product.sizes?.[0] || 'Standard',
        color: selectedColor || product.colors?.[0]?.name || 'Standard',
        quantity,
      })
    );
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleReviewAdded = (newRev, newRating) => {
    setReviews([newRev, ...reviews]);
    if (newRating) {
      setProduct({
        ...product,
        ratingAverage: newRating.ratingAverage,
        ratingCount: newRating.ratingCount,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Runway Collections', path: '/shop' },
          { label: product.category?.name || 'Category', path: `/shop?category=${product.category?.slug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-4">
        {/* Left Side: Editorial Image Gallery (7 cols) */}
        <div className="lg:col-span-7">
          <ProductImageGallery images={product.images} />
        </div>

        {/* Right Side: Product Details & Variant Selectors (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & Badges */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-luxury-500">
                {product.brand}
              </span>
              <div className="flex gap-2">
                {product.discountPercentage > 0 && (
                  <Badge variant="sale">-{product.discountPercentage}% Privilege</Badge>
                )}
                {product.isNewArrival && <Badge variant="neutral">New Runway Debut</Badge>}
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-luxury-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(product.ratingAverage || 5)
                        ? 'fill-luxury-gold text-luxury-gold'
                        : 'text-luxury-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-luxury-600 font-sans font-medium">
                {product.ratingAverage} ({product.ratingCount || 0} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-1 border-b border-luxury-200 pb-4">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-luxury-950">
                {formatCurrency(effectivePrice)}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-luxury-400 line-through font-sans">
                  {formatCurrency(product.price)}
                </span>
              )}
              <span className="text-[11px] uppercase tracking-wider text-luxury-500 font-medium">
                Inclusive of Luxury Import Duties & Taxes
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-luxury-700 font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Color Palette Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-luxury-900">
                    Color: <strong className="text-luxury-950 font-medium">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                        selectedColor === col.name
                          ? 'border-luxury-950 scale-110'
                          : 'border-transparent hover:border-luxury-400'
                      }`}
                      title={col.name}
                    >
                      <span
                        className="block w-full h-full rounded-full border border-luxury-200"
                        style={{ backgroundColor: col.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector with Size Guide Button */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-luxury-900">
                    Size: <strong className="text-luxury-950 font-medium">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-luxury-600 hover:text-luxury-950 underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`py-3 text-xs uppercase tracking-wider font-medium border transition-colors ${
                        selectedSize === s
                          ? 'border-luxury-950 bg-luxury-950 text-white'
                          : 'border-luxury-200 text-luxury-800 hover:border-luxury-900 bg-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability */}
            <div className="pt-2 flex items-center gap-2 text-xs text-luxury-600 font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>
                Available in Atelier ({product.totalStock} units ready for white-glove dispatch)
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center gap-4">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-luxury-900">
                Quantity:
              </span>
              <div className="inline-flex items-center border border-luxury-300">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-luxury-700 hover:bg-luxury-100 disabled:opacity-30"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-luxury-950">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.totalStock}
                  onClick={() => setQuantity((q) => Math.min(product.totalStock, q + 1))}
                  className="px-3 py-2 text-luxury-700 hover:bg-luxury-100 disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div className="pt-4 space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2"
                  size="lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </Button>

                <button
                  type="button"
                  onClick={() => dispatch(toggleWishlistItem(product))}
                  className={`p-4 border border-luxury-950 transition-colors ${
                    isInWishlist
                      ? 'bg-rose-50 border-rose-600 text-rose-700'
                      : 'bg-white text-luxury-950 hover:bg-luxury-100'
                  }`}
                  aria-label="Wishlist"
                  title={isInWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-700' : ''}`} />
                </button>
              </div>

              <Button
                onClick={handleBuyNow}
                variant="gold"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
              >
                <span>Direct Checkout</span>
              </Button>
            </div>

            {/* Added Notice */}
            {addedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Garment successfully added to your shopping bag.</span>
              </div>
            )}
          </div>

          {/* Accordion Details */}
          <div className="border-t border-luxury-200 divide-y divide-luxury-200 pt-6">
            {/* Composition & Care */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('materials')}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-widest font-semibold text-luxury-950"
              >
                <span>Fabric Composition & Craftsmanship</span>
                {openAccordions.materials ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordions.materials && (
                <div className="pt-3 text-xs text-luxury-600 space-y-1.5 font-sans leading-relaxed">
                  <p><strong>Composition:</strong> {product.details?.materials || '100% Fine Luxury Textile'}</p>
                  <p><strong>Care:</strong> {product.details?.care || 'Dry clean only by luxury textile care specialist'}</p>
                </div>
              )}
            </div>

            {/* Origin & Atelier */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('origin')}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-widest font-semibold text-luxury-950"
              >
                <span>Origin & Provenance</span>
                {openAccordions.origin ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordions.origin && (
                <div className="pt-3 text-xs text-luxury-600 font-sans leading-relaxed">
                  <p>{product.details?.origin || 'Handmade in Milan, Italy'}. Individual numbered certificate of atelier authenticity enclosed with delivery.</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-widest font-semibold text-luxury-950"
              >
                <span>Complimentary Delivery & Returns</span>
                {openAccordions.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordions.shipping && (
                <div className="pt-3 text-xs text-luxury-600 font-sans space-y-1.5 leading-relaxed">
                  <p>• Complimentary white-glove express delivery on orders over ₹15,000.</p>
                  <p>• Estimated delivery: 2-4 business days with signature required upon receipt.</p>
                  <p>• Complimentary 14-day return window in original unworn condition with designer tags attached.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Client Critiques Section */}
      <section className="mt-20 pt-12 border-t border-luxury-200">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-luxury-500 font-semibold">
              Client Feedback
            </span>
            <h3 className="font-serif text-3xl text-luxury-950 font-normal">
              Atelier Critiques & Reviews
            </h3>
            <p className="text-xs text-luxury-600 max-w-md mx-auto font-sans">
              Verified acquisitions and collector thoughts on fit, drape, and tactile quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <ReviewList reviews={reviews} />
            </div>
            <div className="md:col-span-5">
              <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-luxury-200">
          <div className="mb-8 text-center space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-luxury-500 font-semibold">
              Curated Recommendations
            </span>
            <h3 className="font-serif text-3xl text-luxury-950 font-normal">
              Complete The Runway Ensemble
            </h3>
          </div>
          <ProductGrid products={relatedProducts} columns="grid-cols-2 md:grid-cols-4" />
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};

export default ProductDetailsPage;
