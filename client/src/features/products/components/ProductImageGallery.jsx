import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';

export const ProductImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const activeImage = images[activeIndex] || images[0] || '';

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[650px] shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`w-16 sm:w-20 aspect-[3/4] bg-luxury-100 overflow-hidden border transition-all ${
                activeIndex === idx
                  ? 'border-luxury-950 opacity-100 ring-1 ring-luxury-950'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image with Zoom */}
      <div
        className="relative flex-1 aspect-[3/4] bg-luxury-100 overflow-hidden cursor-crosshair group shadow-lg"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={activeImage}
          alt="Product Haute Runway"
          className="w-full h-full object-cover transition-transform duration-200"
          style={
            isZoomed
              ? {
                  transform: 'scale(1.8)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }
              : { transform: 'scale(1)' }
          }
        />

        <div className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4 text-luxury-900" />
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
