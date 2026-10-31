import express from 'express';
import {
  getAdminAnalytics,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateOrderStatus,
  getAdminUsers,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Enforce admin role authentication
router.use(protect, authorize('admin'));

router.get('/analytics', getAdminAnalytics);

// Product management
router.get('/products', getAdminProducts);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);

// Order management
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

// User management
router.get('/users', getAdminUsers);

export default router;
