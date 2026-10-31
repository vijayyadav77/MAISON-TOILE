import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Pagination from '../../../components/common/Pagination.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import FilterDrawer from '../components/FilterDrawer.jsx';
import SortDropdown from '../components/SortDropdown.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { productService } from '../services/productService.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [facets, setFacets] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Extracted query params
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const sizeParam = searchParams.get('size') || '';
  const colorParam = searchParams.get('color') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const searchKeyword = searchParams.get('search') || '';
  const newArrival = searchParams.get('newArrival') || '';
  const trending = searchParams.get('trending') || '';

  const selectedBrands = brandParam ? brandParam.split(',') : [];
  const selectedSizes = sizeParam ? sizeParam.split(',') : [];
  const selectedColors = colorParam ? colorParam.split(',') : [];
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : 200000;

  useDocumentTitle(
    searchKeyword
      ? `Search: "${searchKeyword}"`
      : categoryParam
      ? `${categoryParam.replace(/-/g, ' ').toUpperCase()}`
      : 'Curated Designer Runway Catalog'
  );

  // Load facets once
  useEffect(() => {
    productService.getProductFacets().then((res) => {
      setFacets(res.facets || {});
    }).catch(console.error);
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = {
          page: pageParam,
          limit: 12,
          sort: sortParam,
          category: categoryParam || undefined,
          brand: brandParam || undefined,
          size: sizeParam || undefined,
          color: colorParam || undefined,
          maxPrice: maxPriceParam || undefined,
          search: searchKeyword || undefined,
          newArrival: newArrival || undefined,
          trending: trending || undefined,
        };

        const data = await productService.getProducts(params);
        setProducts(data.products || []);
        setTotalCount(data.total || 0);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [searchParams]);

  // Update query params helper
  const updateQuery = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || (Array.isArray(value) && value.length === 0)) {
      nextParams.delete(key);
    } else if (Array.isArray(value)) {
      nextParams.set(key, value.join(','));
    } else {
      nextParams.set(key, value);
    }
    nextParams.set('page', '1'); // reset page on filter change
    setSearchParams(nextParams);
  };

  const handleSelectCategory = (slug) => updateQuery('category', slug);

  const handleToggleBrand = (brand) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    updateQuery('brand', updated);
  };

  const handleToggleSize = (size) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    updateQuery('size', updated);
  };

  const handleToggleColor = (color) => {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    updateQuery('color', updated);
  };

  const handlePriceChange = (val) => updateQuery('maxPrice', val.toString());
  const handleSortChange = (val) => updateQuery('sort', val);
  const handlePageChange = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', page.toString());
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    categoryParam ||
    selectedBrands.length ||
    selectedSizes.length ||
    selectedColors.length ||
    maxPriceParam ||
    searchKeyword
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        items={[
          { label: 'Runway Collections', path: '/shop' },
          ...(categoryParam ? [{ label: categoryParam.replace(/-/g, ' ') }] : []),
          ...(searchKeyword ? [{ label: `Search: "${searchKeyword}"` }] : []),
        ]}
      />

      {/* Catalog Title & Subtitle */}
      <div className="pt-2 pb-8 border-b border-luxury-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal capitalize">
            {searchKeyword
              ? `Results for "${searchKeyword}"`
              : categoryParam
              ? categoryParam.replace(/-/g, ' ')
              : 'All Runway Collections'}
          </h1>
          <p className="text-xs uppercase tracking-widest text-luxury-500 mt-1 font-medium">
            Showing {totalCount} Haute Couture Designs
          </p>
        </div>

        {/* Filter Drawer Toggle & Sort Dropdown */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-luxury-300 text-xs uppercase tracking-wider font-medium text-luxury-900"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && `(${selectedBrands.length + selectedSizes.length + (categoryParam ? 1 : 0)})`}</span>
          </button>
          <SortDropdown value={sortParam} onChange={handleSortChange} />
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="py-4 flex flex-wrap items-center gap-2 border-b border-luxury-200">
          <span className="text-[11px] uppercase tracking-widest text-luxury-400 font-semibold mr-1">
            Active Filters:
          </span>
          {categoryParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-luxury-100 text-luxury-900 border border-luxury-200">
              <span className="capitalize">{categoryParam.replace(/-/g, ' ')}</span>
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-700" onClick={() => handleSelectCategory('')} />
            </span>
          )}
          {selectedBrands.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-luxury-100 text-luxury-900 border border-luxury-200">
              <span>{b}</span>
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-700" onClick={() => handleToggleBrand(b)} />
            </span>
          ))}
          {selectedSizes.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-luxury-100 text-luxury-900 border border-luxury-200">
              <span>Size: {s}</span>
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-700" onClick={() => handleToggleSize(s)} />
            </span>
          ))}
          {selectedColors.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-luxury-100 text-luxury-900 border border-luxury-200">
              <span>Color: {c}</span>
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-700" onClick={() => handleToggleColor(c)} />
            </span>
          ))}
          <button
            onClick={handleResetFilters}
            className="text-[11px] uppercase tracking-wider text-rose-700 underline font-semibold ml-2 hover:text-rose-900"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Catalog Layout */}
      <div className="pt-8 flex gap-8">
        {/* Desktop Sidebar Filters */}
        <FilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          facets={facets}
          selectedCategory={categoryParam}
          onSelectCategory={handleSelectCategory}
          selectedBrands={selectedBrands}
          onToggleBrand={handleToggleBrand}
          selectedSizes={selectedSizes}
          onToggleSize={handleToggleSize}
          selectedColors={selectedColors}
          onToggleColor={handleToggleColor}
          priceRange={{ min: 0, max: maxPrice }}
          onPriceChange={handlePriceChange}
          onResetFilters={handleResetFilters}
          totalResults={totalCount}
        />

        {/* Product Grid Area */}
        <div className="flex-1">
          {!loading && products.length === 0 ? (
            <EmptyState
              title="No Haute Couture Pieces Found"
              description="No garments or accessories currently match the active filter criteria. Try expanding your price range or clearing your filters."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <ProductGrid
                products={products}
                isLoading={loading}
                skeletonCount={12}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                columns="grid-cols-2 md:grid-cols-3"
              />
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Global Quick View Modal */}
      <QuickViewModal
        isOpen={Boolean(quickViewProduct)}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default ProductListingPage;
