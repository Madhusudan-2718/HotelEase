import express from 'express';
import {
  getStaffMembers,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staffController.js';

const router = express.Router();

// GET /api/staff - Get all staff (with optional query params: department, status, rating, search)
router.get('/', getStaffMembers);

// GET /api/staff/:id - Get staff by ID
router.get('/:id', getStaffById);

// POST /api/staff - Create new staff member
router.post('/', createStaff);

// PATCH /api/staff/:id - Update staff member
router.patch('/:id', updateStaff);

// DELETE /api/staff/:id - Delete staff member
router.delete('/:id', deleteStaff);

export default router;


