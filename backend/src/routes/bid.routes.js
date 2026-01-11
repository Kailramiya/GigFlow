import express from 'express';
import {
  createBid,
  getBidsForGig,
  getMyBids,
  getBidById,
  updateBidStatus,
  deleteBid,
  hireBid,
} from '../controllers/bid.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All bid routes require authentication
router.post('/', protect, createBid);
router.get('/my-bids', protect, getMyBids);
router.get('/gig/:gigId', protect, getBidsForGig);
router.post('/:id/hire', protect, hireBid);
router.put('/:id', protect, updateBidStatus);
router.get('/:id', protect, getBidById);
router.delete('/:id', protect, deleteBid);

export default router;