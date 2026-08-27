const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/auth/User');
require('dotenv').config();

class AuthService {
  /**
   * Hash password
   * @param {string} password - Plain password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} True if password matches
   */
  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Register a new user
   * @param {Object} userData - {name, email, password}
   * @returns {Promise<Object>} {success: boolean, message: string, user?: Object}
   */
  static async register(userData) {
    try {
      const { name, email, password } = userData;

      // Validate input
      if (!name || !email || !password) {
        return {
          success: false,
          message: 'Name, email, and password are required'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Invalid email format'
        };
      }

      // Validate password length
      if (password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long'
        };
      }

      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      // Generate token
      const token = this.generateToken(user.id);

      return {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed: ' + error.message
      };
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} {success: boolean, message: string, user?: Object, token?: string}
   */
  static async login(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required'
        };
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Compare passwords
      const isPasswordValid = await this.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate token
      const token = this.generateToken(user.id);

      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          profile_picture: user.profile_picture
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed: ' + error.message
      };
    }
  }

  /**
   * Generate JWT token
   * @param {number} userId - User ID
   * @returns {string} JWT token
   */
  static generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object|null} Decoded token or null if invalid
   */
  static verifyToken(token) {
    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production'
      );
    } catch (error) {
      console.error('Token verification error:', error.message);
      return null;
    }
  }

  /**
   * Get user profile by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} User profile or null
   */
  static async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} {success: boolean, message: string, user?: Object}
   */
  static async updateUserProfile(userId, updateData) {
    try {
      const updatedUser = await User.updateProfile(userId, updateData);
      
      return {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Update failed: ' + error.message
      };
    }
  }

  /**
   * Change password
   * @param {number} userId - User ID
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} {success: boolean, message: string}
   */
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      if (!oldPassword || !newPassword) {
        return {
          success: false,
          message: 'Old password and new password are required'
        };
      }

      if (newPassword.length < 6) {
        return {
          success: false,
          message: 'New password must be at least 6 characters long'
        };
      }

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Verify old password
      const isPasswordValid = await this.comparePassword(oldPassword, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect'
        };
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update password
      await User.updatePassword(userId, hashedPassword);

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Password change failed: ' + error.message
      };
    }
  }
}

module.exports = AuthService;
