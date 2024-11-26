import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:id', authenticateToken, orderController.getOrder);
router.get('/seller', authenticateToken, orderController.getSellerOrders);
router.patch('/:id/status', authenticateToken, orderController.updateOrderStatus);

export default router;