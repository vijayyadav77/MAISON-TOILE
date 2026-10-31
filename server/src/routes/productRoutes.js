import express from 'express';
import {
  getProducts,
  getProductByIdentifier,
  getRelatedProducts,
  getProductFacets,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/facets/all', getProductFacets);
router.get('/:identifier', getProductByIdentifier);
router.get('/:id/related', getRelatedProducts);

export default router;
