import Gig from '../models/Gig.js';
import {
  validateGigTitle,
  validateDescription,
  validateBudget,
  validateGigStatus,
} from '../utils/validation.js';

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const errors = {};

    // Validate each field
    const titleError = validateGigTitle(title);
    const descError = validateDescription(description);
    const budgetError = validateBudget(budget);

    if (titleError) errors.title = titleError;
    if (descError) errors.description = descError;
    if (budgetError) errors.budget = budgetError;

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Create gig with authenticated user as owner
    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id,
    });

    // Populate owner details
    await gig.populate('ownerId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      gig,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating gig',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get all gigs with status 'open' and optional title search
// @route   GET /api/gigs
// @access  Public
export const getAllGigs = async (req, res) => {
  try {
    const { title, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { status: 'open' };

    // Add title search if provided (case-insensitive)
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get gigs with pagination
    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Gig.countDocuments(query);

    res.status(200).json({
      success: true,
      count: gigs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      gigs,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gigs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get a single gig by ID
// @route   GET /api/gigs/:id
// @access  Public
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    res.status(200).json({
      success: true,
      gig,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gig',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Update a gig
// @route   PUT /api/gigs/:id
// @access  Private (Owner only)
export const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this gig',
      });
    }

    const { title, description, budget, status } = req.body;
    const errors = {};

    // Validate only provided fields
    if (title !== undefined) {
      const titleError = validateGigTitle(title);
      if (titleError) errors.title = titleError;
    }
    if (description !== undefined) {
      const descError = validateDescription(description);
      if (descError) errors.description = descError;
    }
    if (budget !== undefined) {
      const budgetError = validateBudget(budget);
      if (budgetError) errors.budget = budgetError;
    }
    if (status !== undefined) {
      const statusError = validateGigStatus(status);
      if (statusError) errors.status = statusError;
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Update fields if provided
    if (title) gig.title = title;
    if (description) gig.description = description;
    if (budget !== undefined) gig.budget = budget;
    if (status) gig.status = status;

    await gig.save();
    await gig.populate('ownerId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Gig updated successfully',
      gig,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating gig',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
// @access  Private (Owner only)
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this gig',
      });
    }

    await gig.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully',
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting gig',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get user's own gigs
// @route   GET /api/gigs/my-gigs
// @access  Private
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('ownerId', 'name email');

    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your gigs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};