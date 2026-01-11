import express from 'express';
import {
  createGig,
  getAllGigs,
  getGigById,
  updateGig,
  deleteGig,
  getMyGigs,
} from '../controllers/gig.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes first (before /:id to avoid route conflict)
router.post('/', protect, createGig);
router.get('/user/my-gigs', protect, getMyGigs);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);

// Public routes last
router.get('/', getAllGigs);
router.get('/:id', getGigById);

export default router;