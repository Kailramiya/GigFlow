import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import { emitHiringNotification } from '../socket/socketHandlers.js';
import {
  validateBidMessage,
  validatePrice,
  validateBidStatus,
} from '../utils/validation.js';

// @desc    Create a new bid
// @route   POST /api/bids
// @access  Private
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;
    const errors = {};

    // Validate each field
    if (!gigId) {
      errors.gigId = 'Gig ID is required';
    }
    const msgError = validateBidMessage(message);
    const priceError = validatePrice(price);

    if (msgError) errors.message = msgError;
    if (priceError) errors.price = priceError;

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Prevent gig owner from bidding on their own gig
    if (gig.ownerId.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: {
          gigId: 'You cannot bid on your own gig',
        },
      });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: {
          gigId: `Cannot bid on a gig with status '${gig.status}'`,
        },
      });
    }

    // Check for duplicate bid (same freelancer on same gig)
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user.id,
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: {
          gigId: 'You have already placed a bid on this gig',
        },
      });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price,
    });

    // Populate references
    await bid.populate('gigId', 'title description budget');
    await bid.populate('freelancerId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully',
      bid,
    });
  } catch (error) {
    // Handle duplicate key error from unique index
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: {
          gigId: 'You have already placed a bid on this gig',
        },
      });
    }

    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating bid',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get all bids for a specific gig (owner only)
// @route   GET /api/bids/gig/:gigId
// @access  Private (Gig owner only)
export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Ensure only gig owner can view all bids
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view bids for this gig',
      });
    }

    // Get all bids for the gig
    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bids',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get user's own bids
// @route   GET /api/bids/my-bids
// @access  Private
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id })
      .populate('gigId', 'title description budget status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your bids',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get a single bid by ID
// @route   GET /api/bids/:id
// @access  Private
export const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('gigId', 'title description budget')
      .populate('freelancerId', 'name email');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    // Check if user is either the bid owner or gig owner
    const gig = await Gig.findById(bid.gigId);
    if (bid.freelancerId._id.toString() !== req.user.id && gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this bid',
      });
    }

    res.status(200).json({
      success: true,
      bid,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bid',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Update bid status (gig owner can accept/reject, freelancer can withdraw)
// @route   PUT /api/bids/:id
// @access  Private
export const updateBidStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const errors = {};

    const statusError = validateBidStatus(status);
    if (statusError) errors.status = statusError;

    if (!status) {
      errors.status = 'Status is required';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const bid = await Bid.findById(req.params.id).populate('gigId');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    // Freelancer can only withdraw their own bid
    if (status === 'withdrawn') {
      if (bid.freelancerId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only withdraw your own bids',
        });
      }

      if (bid.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Can only withdraw pending bids',
        });
      }
    }

    // Gig owner can accept or reject bids
    if (status === 'accepted' || status === 'rejected') {
      const gig = await Gig.findById(bid.gigId);
      if (gig.ownerId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Only the gig owner can accept or reject bids',
        });
      }

      if (bid.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Can only accept or reject pending bids',
        });
      }
    }

    bid.status = status;
    await bid.save();

    await bid.populate('freelancerId', 'name email');

    res.status(200).json({
      success: true,
      message: `Bid ${status} successfully`,
      bid,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bid',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Delete a bid
// @route   DELETE /api/bids/:id
// @access  Private (Bid owner only)
export const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    // Check if user is the bid owner
    if (bid.freelancerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this bid',
      });
    }

    // Only allow deletion of pending bids
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending bids',
      });
    }

    await bid.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bid deleted successfully',
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting bid',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Hire a freelancer (accept bid) with atomic transaction
// @route   POST /api/bids/:id/hire
// @access  Private (Gig owner only)
export const hireBid = async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();

  try {
    // Start transaction
    await session.startTransaction();

    // Find the bid with session
    const bid = await Bid.findById(req.params.id).session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    // Find the gig with session
    const gig = await Gig.findById(bid.gigId).session(session);

    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Verify user is the gig owner
    if (gig.ownerId.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Only the gig owner can hire a freelancer',
      });
    }

    // Check if gig is still open (prevent race conditions)
    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Cannot hire for a gig with status '${gig.status}'. A freelancer may have already been hired.`,
      });
    }

    // Check if bid is still pending
    if (bid.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Cannot hire a bid with status '${bid.status}'`,
      });
    }

    // Atomic operations within transaction:
    // 1. Accept the selected bid
    bid.status = 'accepted';
    await bid.save({ session });

    // 2. Reject all other pending bids for this gig
    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
        status: 'pending',
      },
      {
        $set: { status: 'rejected' },
      },
      { session }
    );

    // 3. Update gig status to in-progress
    gig.status = 'in-progress';
    await gig.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // Get io instance from app and emit notification
    const io = req.app.get('io');
    emitHiringNotification(io, bid.freelancerId, bid, gig);

    // Populate bid details for response
    await bid.populate('freelancerId', 'name email');
    await bid.populate('gigId', 'title description budget status');

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      bid,
      gig: {
        id: gig._id,
        title: gig.title,
        status: gig.status,
      },
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();

    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while hiring freelancer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    // End session
    session.endSession();
  }
};