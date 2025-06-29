const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const validatePasswordUpdate = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { firstName, lastName, email, phone, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists',
      message: 'An account with this email already exists'
    });
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    phone,
    password
  });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  // Send verification email (optional)
  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to VIP Motors - Verify Your Email',
      template: 'emailVerification',
      data: {
        name: user.firstName,
        verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
      }
    });
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    // Don't fail registration if email fails
  }

  // Generate tokens
  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token,
      refreshToken
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user by email and include password
  const user = await User.findByEmail(email).select('+password');
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    });
  }

  // Check if account is locked
  if (user.isLocked) {
    return res.status(423).json({
      success: false,
      error: 'Account locked',
      message: 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later.'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Account deactivated',
      message: 'Your account has been deactivated. Please contact support.'
    });
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    // Increment login attempts
    await user.incLoginAttempts();
    
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    });
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  // Generate tokens
  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin
      },
      token,
      refreshToken
    }
  });
}));

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: 'Refresh token required',
      message: 'Please provide a refresh token'
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        message: 'User not found or account deactivated'
      });
    }

    // Generate new tokens
    const newToken = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
      message: 'The refresh token is invalid or expired'
    });
  }
}));

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', validatePasswordReset, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email } = req.body;

  const user = await User.findByEmail(email);
  
  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  }

  // Generate password reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // Send password reset email
  try {
    await sendEmail({
      to: user.email,
      subject: 'VIP Motors - Password Reset Request',
      template: 'passwordReset',
      data: {
        name: user.firstName,
        resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      }
    });

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Password reset email error:', error);
    
    // Clear the reset token if email fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(500).json({
      success: false,
      error: 'Email sending failed',
      message: 'Failed to send password reset email. Please try again later.'
    });
  }
}));

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', validatePasswordUpdate, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { token, password } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Token required',
      message: 'Password reset token is required'
    });
  }

  // Hash the token to compare with stored hash
  const hashedToken = require('crypto')
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired token',
      message: 'Password reset token is invalid or has expired'
    });
  }

  // Update password and clear reset token
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password has been reset successfully'
  });
}));

// @route   POST /api/auth/verify-email
// @desc    Verify email with token
// @access  Public
router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Token required',
      message: 'Email verification token is required'
    });
  }

  // Hash the token to compare with stored hash
  const hashedToken = require('crypto')
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid verification token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired token',
      message: 'Email verification token is invalid or has expired'
    });
  }

  // Mark email as verified and clear token
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', (req, res) => {
  // In a stateless JWT setup, logout is handled client-side
  // You could implement a blacklist here if needed
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router; 