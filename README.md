# MAISON ÉTOILE — Luxury High-Fashion E-Commerce Platform
> A full-stack MERN e-commerce application inspired by the editorial elegance, minimalist luxury, and runway presentation of **FWRD**.

[![MongoDB](https://img.shields.io/badge/Database-MongoDB%208.0-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js-000000?style=flat&logo=express)](https://expressjs.com/)
[![React.js](https://img.shields.io/badge/Frontend-React%2018%20+%20Vite-61DAFB?style=flat&logo=react)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js%2024-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Payment-Razorpay%20Test%20Gateway-0C2340?style=flat&logo=razorpay)](https://razorpay.com/)

---

## 1. Project Overview

**Maison Étoile** is an end-to-end luxury fashion e-commerce platform built for high-end designer runway clothing, evening couture, tailoring, leather goods, and fine accessories. 

### Key Highlights:
- **Editorial FWRD-Inspired Aesthetic**: Minimalist luxury palette (Obsidian `#0A0A0A`, Warm Cream `#FAF7F2`, Champagne Gold `#C5A880`), Cormorant Garamond serif and Montserrat typography, high-res runway photography, and micro-animations.
- **Full-Stack MERN Architecture**: Modular, feature-based React frontend powered by Vite, Redux Toolkit, and Tailwind CSS; Express.js REST API with MongoDB/Mongoose schemas.
- **Complete Luxury Shopping Journey**:
  - Live global debounced search with thumbnail previews.
  - Multi-facet catalog filtering (by category, designer brand, size, color, and price range) with multi-mode sorting.
  - Interactive Product Details Page with hover magnifying zoom, size conversion guide, color selectors, and customer reviews.
  - Slide-over Cart & Wishlist Drawers with real-time totals and complimentary white-glove shipping progress indicators.
  - Multi-step checkout with address book management and Razorpay payment integration with cryptographic HMAC-SHA256 signature verification.
  - Protected My Account section with step-by-step order tracking timelines (Order Placed &rarr; Confirmed &rarr; In Transit &rarr; Delivered) and self-service cancellations.
  - Role-protected Admin Atelier with analytics dashboard, product catalog management, and order fulfillment status controls.

---

## 2. Technology Stack

### Frontend (`client/`)
- **Core**: React 18 with Vite
- **Styling**: Tailwind CSS with custom luxury typography and design tokens
- **State Management**: Redux Toolkit (`authSlice`, `cartSlice`, `wishlistSlice`)
- **Routing**: React Router v6 (with layouts, public routes, and admin route guards)
- **Forms**: React Hook Form with validation
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized request/response interceptors

### Backend (`server/`)
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies and Authorization headers
- **Password Hashing**: bcryptjs
- **Payment Processing**: Razorpay SDK with cryptographic HMAC-SHA256 signature verification
- **Validation**: express-validator and centralized error handling middleware

---

## 3. Directory Structure

```text
d:\vijay/
├── client/
│   ├── src/
│   │   ├── app/                    # Redux store, router, providers
│   │   ├── components/
│   │   │   ├── ui/                 # Button, Input, Modal, Badge, Skeleton, Loader
│   │   │   └── common/             # Navbar, AnnouncementBar, Footer, Breadcrumb, Pagination, EmptyState
│   │   ├── layouts/                # MainLayout, AuthLayout, AdminLayout
│   │   ├── features/
│   │   │   ├── home/               # HeroBanner, FeaturedCollections, Trending, Lookbook
│   │   │   ├── products/           # ProductCard, ProductGrid, FilterDrawer, ProductDetailsPage
│   │   │   ├── cart/               # CartDrawer, CartItem, CartPage, cartSlice
│   │   │   ├── wishlist/           # WishlistDrawer, WishlistPage, wishlistSlice
│   │   │   ├── checkout/           # CheckoutPage, OrderSuccessPage
│   │   │   ├── orders/             # OrderHistoryPage, OrderDetailsPage, OrderTimeline
│   │   │   ├── account/            # ProfilePage, AddressesPage
│   │   │   ├── admin/              # AdminDashboard, AdminProducts, AdminOrders, AdminUsers
│   │   │   ├── auth/               # LoginPage, SignupPage, ForgotPasswordPage, authSlice
│   │   │   └── reviews/            # ReviewList, ReviewForm
│   │   ├── services/               # apiClient.js, apiEndpoints.js
│   │   ├── hooks/                  # useDebounce, useDocumentTitle
│   │   └── utils/                  # formatCurrency, formatDate, constants
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/                 # db.js, razorpay.js
│   │   ├── models/                 # User, Product, Category, Cart, Wishlist, Order, Coupon, Review
│   │   ├── controllers/            # Auth, Product, Cart, Order, Payment, Admin, etc.
│   │   ├── routes/                 # Express route definitions
│   │   ├── middleware/             # auth.js, errorHandler.js, validate.js
│   │   ├── seed/                   # seedData.js
│   │   ├── tests/                  # testE2E.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
└── README.md
```

---

## 4. Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### Step 1: Install Backend & Seed Database
```bash
cd server
npm install

# Seed with luxury categories, products, coupons, and test users
npm run seed
```

### Step 2: Start the Backend Server
```bash
npm start
# Server runs on http://localhost:5000
```

### Step 3: Install Frontend & Run Dev Server
```bash
cd ../client
npm install
npm run dev
# Storefront runs on http://localhost:5173
```

---

## 5. Demo Accounts

| Role | Email | Password | Pre-configured Data |
| :--- | :--- | :--- | :--- |
| **VIP Customer** | `audrey@maisonetoile.com` | `Customer@123456` | Pre-saved Altamount Road, Mumbai shipping address |
| **Atelier Admin** | `admin@maisonetoile.com` | `Admin@123456` | Access to `/admin` dashboard, catalog management & orders |

*(Quick demo login buttons are provided on the Sign In page for one-click testing.)*

### Valid Promotional Coupon Codes
- `ÉTOILE15`: 15% discount on orders over ₹15,000 (Max discount ₹15,000)
- `VIPFIRST`: ₹5,000 flat discount on orders over ₹25,000
- `FWRD20`: 20% seasonal runway discount on orders over ₹30,000

---

## 6. REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Create a new customer account
- `POST /api/auth/login`: Authenticate and issue JWT token
- `GET /api/auth/me`: Get current authenticated user profile
- `PUT /api/auth/profile`: Update name, phone, avatar
- `POST /api/auth/addresses`: Add a new shipping address
- `DELETE /api/auth/addresses/:id`: Delete a saved address

### Products & Collections (`/api/products`, `/api/categories`)
- `GET /api/products`: Filter, sort, search, and paginate products
- `GET /api/products/:identifier`: Get product details by slug or ID
- `GET /api/products/facets/all`: Get available brands, sizes, colors, and price limits
- `GET /api/categories`: Retrieve all curated fashion categories

### Cart & Wishlist (`/api/cart`, `/api/wishlist`)
- `GET /api/cart`: Get current user's cart with recalculation
- `POST /api/cart/items`: Add variant to cart with live inventory check
- `PUT /api/cart/items/:id`: Update item quantity
- `DELETE /api/cart/items/:id`: Remove item from cart
- `POST /api/cart/sync`: Synchronize guest session cart into user account
- `GET /api/wishlist`: Retrieve saved wishlist pieces
- `POST /api/wishlist/:productId`: Toggle item in wishlist

### Orders & Payments (`/api/orders`, `/api/payments`)
- `POST /api/orders`: Validate stock, calculate final amounts, and initiate pending order
- `GET /api/orders/my-orders`: Retrieve user's order history
- `GET /api/orders/:id`: Get order dossier with timeline log
- `PUT /api/orders/:id/cancel`: Cancel order and restock inventory
- `POST /api/payments/create-order`: Create Razorpay payment order
- `POST /api/payments/verify`: Cryptographically verify HMAC-SHA256 signature, mark paid, and deduct stock

### Admin Atelier (`/api/admin`) *(Role: admin only)*
- `GET /api/admin/analytics`: KPI metrics (revenue, order counts, stock alerts)
- `GET /api/admin/products`: Full product catalog for administration
- `POST /api/admin/products`: Create a new luxury piece
- `PUT /api/admin/products/:id`: Update garment details and inventory
- `DELETE /api/admin/products/:id`: Delete product
- `GET /api/admin/orders`: View all store orders
- `PUT /api/admin/orders/:id/status`: Update fulfillment status (Confirmed, Shipped, Delivered, Cancelled)
- `GET /api/admin/users`: Client roster and administrator accounts

---

## 7. Automated Testing

To run the end-to-end automated test suite:
```bash
cd server
node src/tests/testE2E.js
```
This tests:
1. Health check
2. Product search & faceted retrieval
3. User authentication & password hashing
4. Cart variant additions
5. Coupon calculation
6. Order creation
7. Razorpay payment order generation
8. Cryptographic signature verification
9. Inventory deduction in MongoDB
10. Order history tracking
11. Admin authorization
12. Admin metrics & order fulfillment
