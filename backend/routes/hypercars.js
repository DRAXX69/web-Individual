const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Hypercar = require('../models/Hypercar');
const { asyncHandler } = require('../middleware/errorHandler');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateHypercar = [
  body('brand')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Brand must be between 1 and 50 characters'),
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Car name must be between 1 and 100 characters'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Year must be a valid year'),
  body('price.amount')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('specs.power.value')
    .isFloat({ min: 0 })
    .withMessage('Power must be a positive number'),
  body('specs.topSpeed.value')
    .isFloat({ min: 0 })
    .withMessage('Top speed must be a positive number'),
  body('specs.acceleration.value')
    .isFloat({ min: 0 })
    .withMessage('Acceleration must be a positive number'),
  body('specs.engine.description')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Engine description must be between 1 and 100 characters'),
  body('description.short')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Short description must be between 1 and 200 characters')
];

// @route   GET /api/hypercars
// @desc    Get all hypercars with filtering and pagination
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    brand,
    minPrice,
    maxPrice,
    minPower,
    maxPower,
    status,
    featured,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = { isActive: true };
  
  if (brand) {
    filter.brand = new RegExp(brand, 'i');
  }
  
  if (minPrice || maxPrice) {
    filter['price.amount'] = {};
    if (minPrice) filter['price.amount'].$gte = parseFloat(minPrice);
    if (maxPrice) filter['price.amount'].$lte = parseFloat(maxPrice);
  }
  
  if (minPower || maxPower) {
    filter['specs.power.value'] = {};
    if (minPower) filter['specs.power.value'].$gte = parseFloat(minPower);
    if (maxPower) filter['specs.power.value'].$lte = parseFloat(maxPower);
  }
  
  if (status) {
    filter.status = status;
  }
  
  if (featured === 'true') {
    filter.isFeatured = true;
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const hypercars = await Hypercar.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('favorites', 'firstName lastName');

  // Get total count for pagination
  const total = await Hypercar.countDocuments(filter);

  // Calculate pagination info
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNextPage = parseInt(page) < totalPages;
  const hasPrevPage = parseInt(page) > 1;

  res.json({
    success: true,
    data: {
      hypercars,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    }
  });
}));

// @route   GET /api/hypercars/featured
// @desc    Get featured hypercars
// @access  Public
router.get('/featured', optionalAuth, asyncHandler(async (req, res) => {
  const hypercars = await Hypercar.findFeatured().limit(6);

  res.json({
    success: true,
    data: hypercars
  });
}));

// @route   GET /api/hypercars/:id
// @desc    Get single hypercar by ID
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const hypercar = await Hypercar.findById(req.params.id);

  if (!hypercar || !hypercar.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Hypercar not found',
      message: 'The requested hypercar does not exist'
    });
  }

  // Increment views if user is authenticated
  if (req.user) {
    await hypercar.incrementViews();
  }

  res.json({
    success: true,
    data: hypercar
  });
}));

// @route   POST /api/hypercars
// @desc    Create new hypercar (Admin only)
// @access  Private/Admin
router.post('/', validateHypercar, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const hypercar = new Hypercar(req.body);
  await hypercar.save();

  res.status(201).json({
    success: true,
    message: 'Hypercar created successfully',
    data: hypercar
  });
}));

// @route   PUT /api/hypercars/:id
// @desc    Update hypercar (Admin only)
// @access  Private/Admin
router.put('/:id', validateHypercar, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const hypercar = await Hypercar.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!hypercar) {
    return res.status(404).json({
      success: false,
      error: 'Hypercar not found',
      message: 'The requested hypercar does not exist'
    });
  }

  res.json({
    success: true,
    message: 'Hypercar updated successfully',
    data: hypercar
  });
}));

// @route   DELETE /api/hypercars/:id
// @desc    Delete hypercar (Admin only)
// @access  Private/Admin
router.delete('/:id', asyncHandler(async (req, res) => {
  const hypercar = await Hypercar.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!hypercar) {
    return res.status(404).json({
      success: false,
      error: 'Hypercar not found',
      message: 'The requested hypercar does not exist'
    });
  }

  res.json({
    success: true,
    message: 'Hypercar deleted successfully'
  });
}));

// @route   POST /api/hypercars/:id/favorite
// @desc    Add hypercar to favorites
// @access  Private
router.post('/:id/favorite', asyncHandler(async (req, res) => {
  const hypercar = await Hypercar.findById(req.params.id);
  
  if (!hypercar || !hypercar.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Hypercar not found',
      message: 'The requested hypercar does not exist'
    });
  }

  // Add to user's favorites
  if (!req.user.favorites.includes(hypercar._id)) {
    req.user.favorites.push(hypercar._id);
    await req.user.save();
    
    // Increment hypercar favorites count
    await hypercar.incrementFavorites();
  }

  res.json({
    success: true,
    message: 'Hypercar added to favorites',
    data: {
      hypercarId: hypercar._id,
      favoritesCount: hypercar.favorites + 1
    }
  });
}));

// @route   DELETE /api/hypercars/:id/favorite
// @desc    Remove hypercar from favorites
// @access  Private
router.delete('/:id/favorite', asyncHandler(async (req, res) => {
  const hypercar = await Hypercar.findById(req.params.id);
  
  if (!hypercar || !hypercar.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Hypercar not found',
      message: 'The requested hypercar does not exist'
    });
  }

  // Remove from user's favorites
  const index = req.user.favorites.indexOf(hypercar._id);
  if (index > -1) {
    req.user.favorites.splice(index, 1);
    await req.user.save();
    
    // Decrement hypercar favorites count
    await hypercar.decrementFavorites();
  }

  res.json({
    success: true,
    message: 'Hypercar removed from favorites',
    data: {
      hypercarId: hypercar._id,
      favoritesCount: Math.max(0, hypercar.favorites - 1)
    }
  });
}));

// @route   GET /api/hypercars/brands
// @desc    Get all unique brands
// @access  Public
router.get('/brands', asyncHandler(async (req, res) => {
  const brands = await Hypercar.distinct('brand', { isActive: true });
  
  res.json({
    success: true,
    data: brands.sort()
  });
}));

// @route   GET /api/hypercars/stats
// @desc    Get hypercar statistics
// @access  Public
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Hypercar.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalHypercars: { $sum: 1 },
        totalValue: { $sum: '$price.amount' },
        avgPrice: { $avg: '$price.amount' },
        maxPower: { $max: '$specs.power.value' },
        maxSpeed: { $max: '$specs.topSpeed.value' },
        avgAcceleration: { $avg: '$specs.acceleration.value' }
      }
    }
  ]);

  const brandCounts = await Hypercar.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$brand',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const statusCounts = await Hypercar.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {},
      brands: brandCounts,
      status: statusCounts
    }
  });
}));

module.exports = router; 