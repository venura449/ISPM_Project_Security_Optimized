const pool = require('../../../config/database');

class User {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT id, name, email, phone, address, profile_picture, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data {name, email, password (hashed)}
   * @returns {Promise<Object>} Created user object with id
   */
  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      const { name, email, password } = userData;
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      return {
        id: result.insertId,
        name,
        email,
        created_at: new Date()
      };
    } finally {
      connection.release();
    }
  }

  /**
   * Update user profile
   * @param {number} id - User ID
   * @param {Object} updateData - Data to update {name, phone, address, profile_picture}
   * @returns {Promise<Object>} Updated user object
   */
  static async updateProfile(id, updateData) {
    const connection = await pool.getConnection();
    try {
      const { name, phone, address, profile_picture } = updateData;
      
      const updates = [];
      const values = [];
      
      if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
      }
      if (phone !== undefined) {
        updates.push('phone = ?');
        values.push(phone);
      }
      if (address !== undefined) {
        updates.push('address = ?');
        values.push(address);
      }
      if (profile_picture !== undefined) {
        updates.push('profile_picture = ?');
        values.push(profile_picture);
      }
      
      if (updates.length === 0) {
        return await this.findById(id);
      }
      
      values.push(id);
      
      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      await connection.query(query, values);
      
      return await this.findById(id);
    } finally {
      connection.release();
    }
  }

  /**
   * Update user password
   * @param {number} id - User ID
   * @param {string} hashedPassword - New hashed password
   * @returns {Promise<boolean>} True if update successful
   */
  static async updatePassword(id, hashedPassword) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<boolean>} True if delete successful
   */
  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  /**
   * Check if email exists
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if email exists
   */
  static async emailExists(email) {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Get all users (for admin purposes)
   * @returns {Promise<Array>} Array of all users (without passwords)
   */
  static async getAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT id, name, email, phone, address, profile_picture, created_at, updated_at FROM users'
      );
      return rows;
    } finally {
      connection.release();
    }
  }
}

module.exports = User;
