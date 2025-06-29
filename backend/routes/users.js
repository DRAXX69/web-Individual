const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
];

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  res.json({
    success: true,
    data: user
  });
}));

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', validateProfileUpdate, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { firstName, lastName, phone, preferences } = req.body;

  // Build update object
  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (phone) updateFields.phone = phone;
  if (preferences) updateFields.preferences = preferences;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateFields,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
}));

// @route   DELETE /api/users/me
// @desc    Deactivate current user account
// @access  Private
router.delete('/me', asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.json({
    success: true,
    message: 'Account deactivated successfully'
  });
}));

// @route   GET /api/users/favorites
// @desc    Get user's favorite hypercars
// @access  Private
router.get('/favorites', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('favorites', 'brand name price specs images');

  res.json({
    success: true,
    data: user.favorites
  });
}));

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, isActive } = req.query;

  // Build filter
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
}));

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private/Admin
router.get('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      message: 'The requested user does not exist'
    });
  }

  res.json({
    success: true,
    data: user
  });
}));

// @route   PUT /api/users/:id
// @desc    Update user by ID (Admin only)
// @access  Private/Admin
router.put('/:id', requireAdmin, validateProfileUpdate, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { firstName, lastName, phone, role, isActive, preferences } = req.body;

  // Build update object
  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (phone) updateFields.phone = phone;
  if (role) updateFields.role = role;
  if (isActive !== undefined) updateFields.isActive = isActive;
  if (preferences) updateFields.preferences = preferences;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      message: 'The requested user does not exist'
    });
  }

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
}));

// @route   DELETE /api/users/:id
// @desc    Deactivate user by ID (Admin only)
// @access  Private/Admin
router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      message: 'The requested user does not exist'
    });
  }

  res.json({
    success: true,
    message: 'User deactivated successfully'
  });
}));

module.exports = router; 