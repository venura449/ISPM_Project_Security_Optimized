const AuthService = require('../../services/auth/AuthService');
const User = require('../../models/auth/User');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const result = await AuthService.register({
        name,
        email,
        password
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Register controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      if (!result.success) {
        return res.status(401).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   * Requires authentication
   */
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await AuthService.getUserProfile(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        user
      });
    } catch (error) {
      console.error('Get profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
        error: error.message
      });
    }
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   * Requires authentication
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, phone, address, profile_picture } = req.body;

      const result = await AuthService.updateUserProfile(userId, {
        name,
        phone,
        address,
        profile_picture
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Update profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }

  /**
   * Change password
   * PUT /api/auth/change-password
   * Requires authentication
   */
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      const result = await AuthService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Change password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      });
    }
  }

  /**
   * Verify token (check if token is valid)
   * POST /api/auth/verify
   */
  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required'
        });
      }

      const decoded = AuthService.verifyToken(token);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      const user = await User.findById(decoded.id);

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        user
      });
    } catch (error) {
      console.error('Verify token controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Token verification failed',
        error: error.message
      });
    }
  }

  /**
   * Logout (client-side, but we can invalidate on server if needed)
   * POST /api/auth/logout
   * Requires authentication
   */
  static async logout(req, res) {
    try {
      // In a real app, you might add token to a blacklist
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
