/**
 * Validation utilities for field-specific error handling
 */

export class ValidationError extends Error {
  constructor(errors = {}) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please provide a valid email address';
  }
  return null;
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

/**
 * Validate name
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.trim().length > 50) {
    return 'Name must not exceed 50 characters';
  }
  return null;
};

/**
 * Validate gig title
 */
export const validateGigTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return 'Title is required';
  }
  if (title.trim().length < 5) {
    return 'Title must be at least 5 characters long';
  }
  if (title.trim().length > 100) {
    return 'Title must not exceed 100 characters';
  }
  return null;
};

/**
 * Validate gig description
 */
export const validateDescription = (description) => {
  if (!description || typeof description !== 'string') {
    return 'Description is required';
  }
  if (description.trim().length < 10) {
    return 'Description must be at least 10 characters long';
  }
  if (description.trim().length > 2000) {
    return 'Description must not exceed 2000 characters';
  }
  return null;
};

/**
 * Validate budget
 */
export const validateBudget = (budget) => {
  if (budget === undefined || budget === null) {
    return 'Budget is required';
  }
  const numBudget = parseFloat(budget);
  if (isNaN(numBudget)) {
    return 'Budget must be a valid number';
  }
  if (numBudget < 0) {
    return 'Budget must be a positive number';
  }
  if (numBudget === 0) {
    return 'Budget must be greater than 0';
  }
  return null;
};

/**
 * Validate price
 */
export const validatePrice = (price) => {
  if (price === undefined || price === null) {
    return 'Price is required';
  }
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) {
    return 'Price must be a valid number';
  }
  if (numPrice < 0) {
    return 'Price must be a positive number';
  }
  if (numPrice === 0) {
    return 'Price must be greater than 0';
  }
  return null;
};

/**
 * Validate bid message
 */
export const validateBidMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return 'Message is required';
  }
  if (message.trim().length < 10) {
    return 'Message must be at least 10 characters long';
  }
  if (message.trim().length > 500) {
    return 'Message must not exceed 500 characters';
  }
  return null;
};

/**
 * Validate gig status
 */
export const validateGigStatus = (status) => {
  const validStatuses = ['open', 'in-progress', 'completed', 'cancelled'];
  if (status && !validStatuses.includes(status)) {
    return `Status must be one of: ${validStatuses.join(', ')}`;
  }
  return null;
};

/**
 * Validate bid status
 */
export const validateBidStatus = (status) => {
  const validStatuses = ['pending', 'accepted', 'rejected', 'withdrawn'];
  if (status && !validStatuses.includes(status)) {
    return `Status must be one of: ${validStatuses.join(', ')}`;
  }
  return null;
};
