import express from 'express';
import {
  getRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest,
} from '../controllers/housekeepingController.js';

const router = express.Router();

// GET /api/housekeeping - Get all requests (with optional query params: roomNumber, status, userId)
router.get('/', getRequests);

// GET /api/housekeeping/:id - Get request by ID
router.get('/:id', getRequestById);

// POST /api/housekeeping - Create new request
router.post('/', createRequest);

// PATCH /api/housekeeping/:id - Update request status
router.patch('/:id', updateRequestStatus);

// DELETE /api/housekeeping/:id - Delete request
router.delete('/:id', deleteRequest);

export default router;


