import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/restaurantController.js';

const router = express.Router();

// GET /api/orders - Get all orders (with optional query params: roomNumber, status, userId)
router.get('/', getOrders);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById);

// POST /api/orders - Create new order
router.post('/', createOrder);

// PATCH /api/orders/:id - Update order status
router.patch('/:id', updateOrderStatus);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', deleteOrder);

export default router;


