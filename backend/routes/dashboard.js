const express = require('express');
const Hypercar = require('../models/Hypercar');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview data
// @access  Private
router.get('/overview', asyncHandler(async (req, res) => {
  // Get user's favorite hypercars
  const userFavorites = await Hypercar.find({
    _id: { $in: req.user.favorites },
    isActive: true
  }).select('brand name price specs images');

  // Get recent hypercars
  const recentHypercars = await Hypercar.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('brand name price specs images');

  // Get featured hypercars
  const featuredHypercars = await Hypercar.findFeatured().limit(3);

  // Get user activity stats
  const userStats = {
    totalFavorites: req.user.favorites.length,
    lastLogin: req.user.lastLogin,
    memberSince: req.user.createdAt,
    profileComplete: req.user.isEmailVerified && req.user.profilePicture
  };

  // Get overall stats
  const overallStats = await Hypercar.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalHypercars: { $sum: 1 },
        totalValue: { $sum: '$price.amount' },
        avgPrice: { $avg: '$price.amount' },
        maxPower: { $max: '$specs.power.value' },
        maxSpeed: { $max: '$specs.topSpeed.value' }
      }
    }
  ]);

  // Get brand distribution
  const brandDistribution = await Hypercar.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$brand',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price.amount' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Get price range distribution
  const priceRanges = [
    { min: 0, max: 1000000, label: 'Under $1M' },
    { min: 1000000, max: 2000000, label: '$1M - $2M' },
    { min: 2000000, max: 3000000, label: '$2M - $3M' },
    { min: 3000000, max: 4000000, label: '$3M - $4M' },
    { min: 4000000, max: Infinity, label: 'Over $4M' }
  ];

  const priceDistribution = await Promise.all(
    priceRanges.map(async (range) => {
      const count = await Hypercar.countDocuments({
        isActive: true,
        'price.amount': { $gte: range.min, $lt: range.max }
      });
      return { ...range, count };
    })
  );

  res.json({
    success: true,
    data: {
      userStats,
      overallStats: overallStats[0] || {},
      userFavorites,
      recentHypercars,
      featuredHypercars,
      brandDistribution,
      priceDistribution
    }
  });
}));

// @route   GET /api/dashboard/favorites
// @desc    Get user's favorite hypercars
// @access  Private
router.get('/favorites', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const favorites = await Hypercar.find({
    _id: { $in: req.user.favorites },
    isActive: true
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = req.user.favorites.length;
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      favorites,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
}));

// @route   GET /api/dashboard/recommendations
// @desc    Get personalized hypercar recommendations
// @access  Private
router.get('/recommendations', asyncHandler(async (req, res) => {
  // Get user's favorite brands
  const userFavorites = await Hypercar.find({
    _id: { $in: req.user.favorites },
    isActive: true
  }).select('brand');

  const favoriteBrands = [...new Set(userFavorites.map(car => car.brand))];

  // Get recommendations based on favorite brands
  const brandRecommendations = await Hypercar.find({
    brand: { $in: favoriteBrands },
    _id: { $nin: req.user.favorites },
    isActive: true
  })
    .sort({ 'specs.power.value': -1 })
    .limit(5);

  // Get recommendations based on price range of favorites
  const avgFavoritePrice = userFavorites.length > 0 
    ? userFavorites.reduce((sum, car) => sum + car.price.amount, 0) / userFavorites.length
    : 2000000; // Default to $2M if no favorites

  const priceRangeRecommendations = await Hypercar.find({
    _id: { $nin: req.user.favorites },
    isActive: true,
    'price.amount': {
      $gte: avgFavoritePrice * 0.7,
      $lte: avgFavoritePrice * 1.3
    }
  })
    .sort({ 'specs.power.value': -1 })
    .limit(5);

  // Get trending hypercars (most viewed)
  const trendingHypercars = await Hypercar.find({
    _id: { $nin: req.user.favorites },
    isActive: true
  })
    .sort({ views: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      brandRecommendations,
      priceRangeRecommendations,
      trendingHypercars
    }
  });
}));

// @route   GET /api/dashboard/activity
// @desc    Get user activity and recent actions
// @access  Private
router.get('/activity', asyncHandler(async (req, res) => {
  // Get user's recent activity (this would be expanded with a separate Activity model)
  const recentActivity = [
    {
      type: 'login',
      description: 'Logged in to VIP Motors',
      timestamp: req.user.lastLogin,
      icon: '🔐'
    },
    {
      type: 'favorites',
      description: `Added ${req.user.favorites.length} hypercars to favorites`,
      timestamp: req.user.updatedAt,
      icon: '❤️'
    }
  ];

  // Get recently viewed hypercars (if tracking is implemented)
  const recentlyViewed = await Hypercar.find({
    _id: { $in: req.user.favorites.slice(-5) }, // Last 5 favorites as proxy
    isActive: true
  })
    .select('brand name price specs images')
    .sort({ updatedAt: -1 });

  res.json({
    success: true,
    data: {
      recentActivity,
      recentlyViewed
    }
  });
}));

// @route   GET /api/dashboard/search
// @desc    Search hypercars with advanced filters
// @access  Private
router.get('/search', asyncHandler(async (req, res) => {
  const {
    query,
    brand,
    minPrice,
    maxPrice,
    minPower,
    maxPower,
    minSpeed,
    maxSpeed,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = req.query;

  // Build search filter
  const filter = { isActive: true };
  
  if (query) {
    filter.$or = [
      { brand: new RegExp(query, 'i') },
      { name: new RegExp(query, 'i') },
      { 'description.short': new RegExp(query, 'i') }
    ];
  }
  
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
  
  if (minSpeed || maxSpeed) {
    filter['specs.topSpeed.value'] = {};
    if (minSpeed) filter['specs.topSpeed.value'].$gte = parseFloat(minSpeed);
    if (maxSpeed) filter['specs.topSpeed.value'].$lte = parseFloat(maxSpeed);
  }
  
  if (status) {
    filter.status = status;
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute search
  const results = await Hypercar.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Hypercar.countDocuments(filter);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      results,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      filters: {
        query,
        brand,
        minPrice,
        maxPrice,
        minPower,
        maxPower,
        minSpeed,
        maxSpeed,
        status
      }
    }
  });
}));

// @route   GET /api/dashboard/compare
// @desc    Compare multiple hypercars
// @access  Private
router.get('/compare', asyncHandler(async (req, res) => {
  const { ids } = req.query;
  
  if (!ids) {
    return res.status(400).json({
      success: false,
      error: 'Hypercar IDs required',
      message: 'Please provide hypercar IDs to compare'
    });
  }

  const carIds = ids.split(',').slice(0, 4); // Limit to 4 cars

  const hypercars = await Hypercar.find({
    _id: { $in: carIds },
    isActive: true
  }).sort({ 'specs.power.value': -1 });

  if (hypercars.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'No hypercars found',
      message: 'The specified hypercars were not found'
    });
  }

  // Create comparison data
  const comparison = {
    hypercars,
    specs: {
      power: {
        min: Math.min(...hypercars.map(car => car.specs.power.value)),
        max: Math.max(...hypercars.map(car => car.specs.power.value)),
        avg: hypercars.reduce((sum, car) => sum + car.specs.power.value, 0) / hypercars.length
      },
      topSpeed: {
        min: Math.min(...hypercars.map(car => car.specs.topSpeed.value)),
        max: Math.max(...hypercars.map(car => car.specs.topSpeed.value)),
        avg: hypercars.reduce((sum, car) => sum + car.specs.topSpeed.value, 0) / hypercars.length
      },
      acceleration: {
        min: Math.min(...hypercars.map(car => car.specs.acceleration.value)),
        max: Math.max(...hypercars.map(car => car.specs.acceleration.value)),
        avg: hypercars.reduce((sum, car) => sum + car.specs.acceleration.value, 0) / hypercars.length
      },
      price: {
        min: Math.min(...hypercars.map(car => car.price.amount)),
        max: Math.max(...hypercars.map(car => car.price.amount)),
        avg: hypercars.reduce((sum, car) => sum + car.price.amount, 0) / hypercars.length
      }
    }
  };

  res.json({
    success: true,
    data: comparison
  });
}));

module.exports = router; 