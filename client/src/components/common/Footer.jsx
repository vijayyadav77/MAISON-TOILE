import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Truck, RefreshCw, Sparkles } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-luxury-950 text-luxury-300 font-sans border-t border-luxury-800">
      {/* Brand Guarantees / Luxury Services Banner */}
      <div className="border-b border-luxury-800/80 py-10 bg-luxury-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-luxury-gold shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest text-luxury-100 font-medium">Authenticity Guaranteed</h4>
                <p className="text-[11px] text-luxury-400 mt-0.5">100% certified authentic runway designs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Truck className="w-6 h-6 text-luxury-gold shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest text-luxury-100 font-medium">White-Glove Express</h4>
                <p className="text-[11px] text-luxury-400 mt-0.5">Complimentary shipping on orders ₹15,000+</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RefreshCw className="w-6 h-6 text-luxury-gold shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest text-luxury-100 font-medium">Bespoke Concierge</h4>
                <p className="text-[11px] text-luxury-400 mt-0.5">Complimentary 14-day luxury returns</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="w-6 h-6 text-luxury-gold shrink-0" />
              <div>
                <h4 className="text-xs uppercase tracking-widest text-luxury-100 font-medium">Secure Payments</h4>
                <p className="text-[11px] text-luxury-400 mt-0.5">Verified 256-bit encrypted Razorpay checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Identity & Editorial Bio */}
          <div className="md:col-span-4 space-y-5">
            <span className="font-serif text-2xl font-semibold tracking-widest-plus text-luxury-50 block">
              MAISON ÉTOILE
            </span>
            <p className="text-xs text-luxury-400 leading-relaxed max-w-sm">
              An independent luxury house blending architectural Parisian silhouette drafting with Milanese tailoring and handcrafted Italian leather goods. Designed for discerning collectors worldwide.
            </p>
            <div className="pt-2 text-[11px] text-luxury-400 space-y-1">
              <p><span className="text-luxury-200">Flagship Atelier:</span> Altamount Road, Cumballa Hill, Mumbai 400026</p>
              <p><span className="text-luxury-200">Concierge Desk:</span> contact@maisonetoile.com | +91 98200 11223</p>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-luxury-100 font-semibold">Collections</h3>
            <ul className="space-y-2.5 text-xs text-luxury-400">
              <li><Link to="/shop?category=ready-to-wear" className="hover:text-luxury-100 transition-colors">Ready-to-Wear</Link></li>
              <li><Link to="/shop?category=evening-couture" className="hover:text-luxury-100 transition-colors">Evening Gowns</Link></li>
              <li><Link to="/shop?category=leather-and-handbags" className="hover:text-luxury-100 transition-colors">Leather & Bags</Link></li>
              <li><Link to="/shop?category=designer-footwear" className="hover:text-luxury-100 transition-colors">Designer Footwear</Link></li>
              <li><Link to="/shop?category=fine-accessories" className="hover:text-luxury-100 transition-colors">Fine Accessories</Link></li>
              <li><Link to="/shop?newArrival=true" className="hover:text-luxury-100 transition-colors">Runway Debuts</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-luxury-100 font-semibold">Client Care</h3>
            <ul className="space-y-2.5 text-xs text-luxury-400">
              <li><Link to="/account/orders" className="hover:text-luxury-100 transition-colors">Order Tracking</Link></li>
              <li><Link to="/account/profile" className="hover:text-luxury-100 transition-colors">My Atelier Account</Link></li>
              <li><span className="hover:text-luxury-100 cursor-pointer">Shipping & Customs</span></li>
              <li><span className="hover:text-luxury-100 cursor-pointer">Complimentary Returns</span></li>
              <li><span className="hover:text-luxury-100 cursor-pointer">Garment Care Guide</span></li>
              <li><span className="hover:text-luxury-100 cursor-pointer">Bespoke Fitting</span></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-luxury-100 font-semibold">
              The Atelier Gazette
            </h3>
            <p className="text-xs text-luxury-400 leading-relaxed">
              Receive private invitations to runway previews, seasonal trunk shows, and editorial lookbooks.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-luxury-900 border border-luxury-700 text-luxury-100 text-xs">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Merci. You have been added to our private salon registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-luxury-900 border border-luxury-700 text-xs text-luxury-100 px-4 py-3 pr-12 focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-luxury-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 bottom-0 px-3.5 bg-luxury-800 hover:bg-luxury-gold hover:text-luxury-950 text-luxury-100 transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-luxury-500">
                  By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="mt-16 pt-8 border-t border-luxury-800/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-luxury-500 gap-4">
          <p>© {new Date().getFullYear()} MAISON ÉTOILE S.A. ALL RIGHTS RESERVED. INSPIRED BY FWRD EDITORIAL AESTHETICS.</p>
          <div className="flex items-center gap-6">
            <span className="text-luxury-400">RAZORPAY TEST MODE &bull; VISA &bull; MASTERCARD &bull; UPI &bull; AMEX</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
