import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maison_etoile_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Coupon.deleteMany(),
      Review.deleteMany(),
      Order.deleteMany(),
      Cart.deleteMany(),
      Wishlist.deleteMany(),
    ]);
    console.log('[Seed] Cleared existing collections');

    // 1. Create Users (Admin & Customer)
    const adminUser = await User.create({
      name: 'Maison Étoile Atelier Admin',
      email: 'admin@maisonetoile.com',
      password: 'Admin@123456',
      role: 'admin',
      phone: '+91 98200 11223',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    });

    const demoUser = await User.create({
      name: 'Audrey Sinclair',
      email: 'audrey@maisonetoile.com',
      password: 'Customer@123456',
      role: 'customer',
      phone: '+91 99887 66554',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      addresses: [
        {
          recipientName: 'Audrey Sinclair',
          phone: '+91 99887 66554',
          street: 'Apartment 14B, Altamount Road Towers',
          apartment: 'Altamount Road, Cumballa Hill',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400026',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    console.log('[Seed] Created default users (Admin & Audrey Sinclair)');

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Ready-to-Wear',
        slug: 'ready-to-wear',
        description: 'Architectural tailoring, pure silk slip dresses, and relaxed double-breasted blazers.',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
        bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600',
        featured: true,
        order: 1,
      },
      {
        name: 'Evening Couture',
        slug: 'evening-couture',
        description: 'Sculpted floor-length gowns, dramatic backless silhouettes, and liquid satin drapery.',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
        bannerImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1600',
        featured: true,
        order: 2,
      },
      {
        name: 'Leather & Handbags',
        slug: 'leather-and-handbags',
        description: 'Minimalist calfskin totes, structured top-handle pochettes, and embossed clutch bags.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
        bannerImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1600',
        featured: true,
        order: 3,
      },
      {
        name: 'Designer Footwear',
        slug: 'designer-footwear',
        description: 'Italian leather mules, sculpted slingback pumps, and minimalist leather knee boots.',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
        bannerImage: 'https://images.unsplash.com/photo-1512374382149-233c42b661ac?auto=format&fit=crop&q=80&w=1600',
        featured: true,
        order: 4,
      },
      {
        name: 'Fine Accessories & Jewelry',
        slug: 'fine-accessories',
        description: 'Hand-cast 18k vermeil cuff bracelets, sculptural earrings, and mulberry silk twill foulards.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
        bannerImage: 'https://images.unsplash.com/photo-1611591475152-4783113998f4?auto=format&fit=crop&q=80&w=1600',
        featured: true,
        order: 5,
      },
      {
        name: 'Fine Accessories & Jewelry',
        slug: 'fine-accessories',
        description: 'Hand-cast 18k vermeil cuff bracelets, sculptural earrings, and mulberry silk twill foulards.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
        bannerImage: 'https://images.unsplash.com/photo-1611591475152-4783113998f4?auto=format&fit=crop&q=80&w=1600',
        featured: true,
        order: 6,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach(cat => {
      catMap[cat.slug] = cat._id;
    });

    console.log('[Seed] Created 5 luxury categories');

    // 3. Create Products
    const productsData = [
      {
        name: 'L’Éclipse Sculpted Silk Gown',
        slug: 'leclipse-sculpted-silk-gown',
        brand: 'MAISON ÉTOILE ATELIER',
        description: 'Crafted from double-faced heavyweight mulberry silk, this floor-sweeping gown features an architectural halter neckline, open cowl back, and an effortless side slit engineered for red carpet elegance.',
        details: {
          materials: '100% Mulberry Silk Charmeuse; Silk habotai lining',
          care: 'Specialist dry clean only; Store with garment bag included',
          origin: 'Handmade in Milan, Italy',
        },
        category: catMap['evening-couture'],
        subCategory: 'Dresses',
        price: 84000,
        discountPrice: 72000,
        discountPercentage: 14,
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Noir Obsidian', hex: '#0a0a0a' },
          { name: 'Crème Vanille', hex: '#FAF5EE' },
          { name: 'Bordeaux Profond', hex: '#58111A' },
        ],
        sizes: ['IT 36 / US 0', 'IT 38 / US 2', 'IT 40 / US 4', 'IT 42 / US 6'],
        totalStock: 18,
        isNewArrival: true,
        isTrending: true,
        isFeatured: true,
        ratingAverage: 4.9,
        ratingCount: 16,
      },
      {
        name: 'The Sovereign Oversized Cashmere Overcoat',
        slug: 'the-sovereign-oversized-cashmere-overcoat',
        brand: 'KHAITE STUDIO',
        description: 'An unstructured double-breasted coat tailored from double-faced Mongolian cashmere. Features horn buttons, broad peak lapels, and hand-stitched pick detailing along the edges.',
        details: {
          materials: '90% Virgin Cashmere, 10% Wool; Cupro lining',
          care: 'Dry clean only by luxury textile care specialist',
          origin: 'Made in Florence, Italy',
        },
        category: catMap['ready-to-wear'],
        subCategory: 'Outerwear',
        price: 125000,
        discountPrice: null,
        discountPercentage: 0,
        images: [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Camel Chameau', hex: '#C19A6B' },
          { name: 'Noir Intemporel', hex: '#111111' },
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        totalStock: 12,
        isNewArrival: false,
        isTrending: true,
        isFeatured: true,
        ratingAverage: 5.0,
        ratingCount: 22,
      },
      {
        name: 'Palais Structured Calfskin Tote',
        slug: 'palais-structured-calfskin-tote',
        brand: 'BOTTEGA VÉNÉTIENNE',
        description: 'Sculpted from smooth Box calfskin with polished gold-tone brass hardware. Features clean architectural lines, a detachable crossbody shoulder strap, and suede interior lining with internal zip compartment.',
        details: {
          materials: '100% Full-grain Italian Calfskin; Suede microfiber interior',
          care: 'Keep in dust bag; wipe clean with soft dry cloth',
          origin: 'Artisanal Atelier in Florence',
        },
        category: catMap['leather-and-handbags'],
        subCategory: 'Bags',
        price: 110000,
        discountPrice: 96000,
        discountPercentage: 12,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Noir Mat', hex: '#161616' },
          { name: 'Chocolat Chaud', hex: '#3E2723' },
          { name: 'Beige Sablé', hex: '#D2B48C' },
        ],
        sizes: ['Medium (32 x 24 x 14 cm)', 'Large (38 x 28 x 16 cm)'],
        totalStock: 20,
        isNewArrival: true,
        isTrending: true,
        isFeatured: true,
        ratingAverage: 4.8,
        ratingCount: 31,
      },
      {
        name: 'The Parisian Silk Georgette Trench',
        slug: 'the-parisian-silk-georgette-trench',
        brand: 'SAINT-GERMAIN',
        description: 'A fluid reinterpretation of the iconic military trench coat, rendered in translucent heavyweight silk georgette with mother-of-pearl buttons and a broad storm flap.',
        details: {
          materials: '100% Silk Georgette; Unlined with bound French seams',
          care: 'Delicate dry clean only',
          origin: 'Made in Paris, France',
        },
        category: catMap['ready-to-wear'],
        subCategory: 'Outerwear',
        price: 68000,
        discountPrice: null,
        discountPercentage: 0,
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Sable Doré', hex: '#E6D7B9' },
          { name: 'Noir Minuit', hex: '#0B0B0C' },
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        totalStock: 15,
        isNewArrival: true,
        isTrending: false,
        isFeatured: true,
        ratingAverage: 4.7,
        ratingCount: 9,
      },
      {
        name: 'Aurore Sculptural Kitten Slingback',
        slug: 'aurore-sculptural-kitten-slingback',
        brand: 'JACQUEMUS ÉLÉGANCE',
        description: 'Distinguished by a 55mm architectural slanted heel and an elongated pointed toe, finished in glossy patent calf leather with an elasticated slingback strap.',
        details: {
          materials: '100% Patent Calfskin upper; 100% Leather sole & lining',
          care: 'Use patent leather protector; avoid prolonged humidity',
          origin: 'Made in Spain',
        },
        category: catMap['designer-footwear'],
        subCategory: 'Shoes',
        price: 49500,
        discountPrice: 42000,
        discountPercentage: 15,
        images: [
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Noir Vernis', hex: '#000000' },
          { name: 'Rouge Cerise', hex: '#7D0A0A' },
          { name: 'Blanc Ivoire', hex: '#FDFBF7' },
        ],
        sizes: ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40'],
        totalStock: 25,
        isNewArrival: false,
        isTrending: true,
        isFeatured: true,
        ratingAverage: 4.8,
        ratingCount: 14,
      },
      {
        name: 'The Monceau Sculpted 18k Cuff',
        slug: 'the-monceau-sculpted-18k-cuff',
        brand: 'MAISON ÉTOILE HAUTE JOAILLERIE',
        description: 'An asymmetrical organic statement cuff bracelet cast in recycled brass and dipped in 5 microns of 18k yellow gold with a tactile brushed matte finish.',
        details: {
          materials: '18k Yellow Gold plated brass (5 microns); Nickel-free',
          care: 'Store in anti-tarnish jewelry pouch; avoid perfume and water',
          origin: 'Cast in Valenza, Italy',
        },
        category: catMap['fine-accessories'],
        subCategory: 'Jewelry',
        price: 32000,
        discountPrice: null,
        discountPercentage: 0,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1611591475152-4783113998f4?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Or Jaune 18k', hex: '#D4AF37' },
          { name: 'Argent Sterling', hex: '#C0C0C0' },
        ],
        sizes: ['Small (15cm wrist)', 'Medium (17cm wrist)'],
        totalStock: 30,
        isNewArrival: true,
        isTrending: false,
        isFeatured: false,
        ratingAverage: 4.9,
        ratingCount: 19,
      },
      {
        name: 'Vendôme Double-Breasted Wool Blazer',
        slug: 'vendome-double-breasted-wool-blazer',
        brand: 'THE ROW STUDIO',
        description: 'Engineered with roped shoulders, razor-sharp peak lapels, and a relaxed boxy cut. Woven from breathable tropical virgin wool suitable for year-round styling.',
        details: {
          materials: '100% Super 120s Virgin Wool; 100% Silk lining',
          care: 'Dry clean only by tailoring specialist',
          origin: 'Made in Great Britain',
        },
        category: catMap['ready-to-wear'],
        subCategory: 'Tailoring',
        price: 92000,
        discountPrice: 78000,
        discountPercentage: 15,
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Noir Tailleur', hex: '#141414' },
          { name: 'Craie Ivoire', hex: '#F4F2EC' },
        ],
        sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12'],
        totalStock: 16,
        isNewArrival: false,
        isTrending: true,
        isFeatured: true,
        ratingAverage: 5.0,
        ratingCount: 28,
      },
      {
        name: 'Nocturne Liquid Velvet Slip Dress',
        slug: 'nocturne-liquid-velvet-slip-dress',
        brand: 'MAISON ÉTOILE ATELIER',
        description: 'Sensual 90s minimalism re-imagined. Cut on the bias from plush Italian silk velvet with delicate spaghetti straps and a subtle sweeping puddle hem.',
        details: {
          materials: '82% Rayon, 18% Silk Velvet; Bound edges',
          care: 'Dry clean; steam gently from inside',
          origin: 'Made in France',
        },
        category: catMap['evening-couture'],
        subCategory: 'Dresses',
        price: 58000,
        discountPrice: null,
        discountPercentage: 0,
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Émeraude Sombre', hex: '#0B3B24' },
          { name: 'Noir Onyx', hex: '#0A0A0A' },
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        totalStock: 14,
        isNewArrival: true,
        isTrending: true,
        isFeatured: true,
        ratingAverage: 4.8,
        ratingCount: 11,
      },
      {
        name: 'Atelier Intreccio Woven Clutch',
        slug: 'atelier-intreccio-woven-clutch',
        brand: 'BOTTEGA VÉNÉTIENNE',
        description: 'Featuring the house’s signature amplified intrecciato hand-weaving in butter-soft nappa lambskin. Magnetic frame closure with an organic sculptural clasp.',
        details: {
          materials: '100% Lambskin Nappa; Bonded leather lining',
          care: 'Avoid abrasive surfaces; store with tissue stuffing',
          origin: 'Handmade in Vicenza, Italy',
        },
        category: catMap['leather-and-handbags'],
        subCategory: 'Bags',
        price: 135000,
        discountPrice: 118000,
        discountPercentage: 12,
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Beige Crème', hex: '#EAE5D9' },
          { name: 'Noir', hex: '#111111' },
          { name: 'Cognac', hex: '#8B4513' },
        ],
        sizes: ['One Size (31 x 18 x 12 cm)'],
        totalStock: 9,
        isNewArrival: false,
        isTrending: true,
        isFeatured: true,
        ratingAverage: 4.9,
        ratingCount: 18,
      },
      {
        name: 'Mirage Minimalist Leather Mule',
        slug: 'mirage-minimalist-leather-mule',
        brand: 'THE ROW FOOTWEAR',
        description: 'Sculpted with a gentle squared toe and a carved 60mm column heel. Crafted from supple glove leather with padded footbeds for all-day gallery walks.',
        details: {
          materials: '100% Calf Glove Leather; Hand-buffed leather sole',
          care: 'Condition with clear leather balm periodically',
          origin: 'Made in Italy',
        },
        category: catMap['designer-footwear'],
        subCategory: 'Shoes',
        price: 52000,
        discountPrice: null,
        discountPercentage: 0,
        images: [
          'https://images.unsplash.com/photo-1512374382149-233c42b661ac?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000',
        ],
        colors: [
          { name: 'Noir', hex: '#000000' },
          { name: 'Sable Naturel', hex: '#E8D8C8' },
        ],
        sizes: ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41'],
        totalStock: 22,
        isNewArrival: true,
        isTrending: false,
        isFeatured: false,
        ratingAverage: 4.6,
        ratingCount: 8,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`[Seed] Created ${createdProducts.length} luxury products`);

    // 4. Create Coupons
    const couponsData = [
      {
        code: 'ÉTOILE15',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 15000,
        maxDiscount: 15000,
        description: '15% Privilege discount on orders above ₹15,000',
        isActive: true,
      },
      {
        code: 'VIPFIRST',
        discountType: 'fixed',
        discountValue: 5000,
        minOrderAmount: 25000,
        maxDiscount: 5000,
        description: '₹5,000 luxury welcome reduction on orders over ₹25,000',
        isActive: true,
      },
      {
        code: 'FWRD20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 30000,
        maxDiscount: 20000,
        description: '20% Haute Couture Seasonal discount on orders over ₹30,000',
        isActive: true,
      },
    ];

    await Coupon.insertMany(couponsData);
    console.log('[Seed] Created promotional coupons (ÉTOILE15, VIPFIRST, FWRD20)');

    // 5. Create Reviews for first product
    await Review.create({
      user: demoUser._id,
      userName: demoUser.name,
      product: createdProducts[0]._id,
      rating: 5,
      title: 'Breathtaking drape and pure luxury weight',
      comment: 'The weight of the silk is unmatched. The silhouette fits flawlessly and the craftsmanship is comparable to haute couture houses in Paris.',
      verifiedPurchase: true,
    });

    console.log('[Seed] Database successfully seeded with luxury assets!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
