const express = require('express');
const AuthController = require('../controllers/auth/AuthController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Public Routes
 */

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * @body {string} name - User's full name
 * @body {string} email - User's email (must be unique)
 * @body {string} password - User's password (min 6 characters)
 */
router.post('/register', AuthController.register);

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 * @body {string} email - User's email
 * @body {string} password - User's password
 */
router.post('/login', AuthController.login);

/**
 * @route POST /api/auth/verify
 * @description Verify if a token is valid
 * @access Public
 * @headers {string} authorization - Bearer token
 */
router.post('/verify', AuthController.verifyToken);

/**
 * Protected Routes (require authentication)
 */

/**
 * @route GET /api/auth/profile
 * @description Get current authenticated user's profile
 * @access Private
 * @headers {string} authorization - Bearer token
 */
router.get('/profile', authMiddleware, AuthController.getProfile);

/**
 * @route PUT /api/auth/profile
 * @description Update current user's profile
 * @access Private
 * @headers {string} authorization - Bearer token
 * @body {string} name - User's full name (optional)
 * @body {string} phone - User's phone number (optional)
 * @body {string} address - User's address (optional)
 * @body {string} profile_picture - User's profile picture URL (optional)
 */
router.put('/profile', authMiddleware, AuthController.updateProfile);

/**
 * @route PUT /api/auth/change-password
 * @description Change user's password
 * @access Private
 * @headers {string} authorization - Bearer token
 * @body {string} oldPassword - Current password
 * @body {string} newPassword - New password
 */
router.put('/change-password', authMiddleware, AuthController.changePassword);

/**
 * @route POST /api/auth/logout
 * @description Logout user (client removes token)
 * @access Private
 * @headers {string} authorization - Bearer token
 */
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
