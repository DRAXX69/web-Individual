const express = require('express');
const { signup, signin, getProfile } = require('../controllers/auth/authController');
const { authenticateToken } = require('../middleware/auth');
const adminAuthController = require('../controllers/auth/adminAuthController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', authenticateToken, getProfile);

// Admin registration
router.post('/api/admin/register', adminAuthController.register);
// Admin login
router.post('/api/admin/login', adminAuthController.login);

module.exports = router;