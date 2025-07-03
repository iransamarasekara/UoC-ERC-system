const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');
require('dotenv').config();

const isAuthenticated = async (req, res, next) => {
  try {
    // For development, allow bypassing authentication
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      console.log('Bypassing authentication in development mode');
      // Find a default admin user for development
      const user = await User.findOne({ where: { role: 'ADMIN' } });
      if (user) {
        req.user = user;
        return next();
      } else {
        console.log('No admin user found for bypass auth. Creating a temporary user object.');
        // Create a temporary user object if no admin is found
        req.user = { 
          user_id: 1,
          role: 'ADMIN',
          is_active: true 
        };
        return next();
      }
    }
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    // For development, allow bypassing admin check
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      console.log('Bypassing admin check in development mode');
      return next();
    }
    
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const admin = await Admin.findOne({ where: { user_id: req.user.user_id } });
    
    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

module.exports = { isAuthenticated, isAdmin };