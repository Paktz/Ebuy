import { Router } from 'express';
import ProductController from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProduct);

// Protected routes - require authentication
router.post('/', authenticateToken, ProductController.createProduct);
router.put('/:id', authenticateToken, ProductController.updateProduct);
router.delete('/:id', authenticateToken, ProductController.deleteProduct);
router.get('/seller', authenticateToken, ProductController.getSellerProducts);

export default router;