import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be a positive number'],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in-progress', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
gigSchema.index({ ownerId: 1, status: 1 });
gigSchema.index({ status: 1, createdAt: -1 });

const Gig = mongoose.model('Gig', gigSchema);

export default Gig;