import express from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/travelController.js';

const router = express.Router();

// GET /api/travel - Get all bookings (with optional query params: roomNumber, status, userId)
router.get('/', getBookings);

// GET /api/travel/:id - Get booking by ID
router.get('/:id', getBookingById);

// POST /api/travel - Create new booking
router.post('/', createBooking);

// PATCH /api/travel/:id - Update booking status
router.patch('/:id', updateBookingStatus);

// DELETE /api/travel/:id - Delete booking
router.delete('/:id', deleteBooking);

export default router;


