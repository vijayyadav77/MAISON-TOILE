import React from 'react';

export const AnnouncementBar = () => {
  return (
    <div className="bg-luxury-950 text-luxury-100 text-[11px] tracking-widest uppercase py-2 px-4 text-center border-b border-luxury-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="hidden md:inline-block text-luxury-400">Milan • Paris • Mumbai • New York</span>
        <p className="mx-auto font-medium tracking-editorial">
          Complimentary Luxury Express Shipping on Orders Over ₹15,000 &bull; Privilege Code <span className="text-luxury-gold underline cursor-pointer">ÉTOILE15</span>
        </p>
        <span className="hidden md:inline-block text-luxury-400">Concierge: +91 98200 11223</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
