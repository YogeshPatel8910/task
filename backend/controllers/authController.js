const { authService } = require('../services');

exports.register = async (req, res) => {
  try {
    const { name, email, password, address, role, store } = req.body;
    
    if (!name || !email || !password || !address) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const userRole = role || 'user';
    
    const result = await authService.registerUser(name, email, password, address, userRole, store);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};


exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
      
      const result = await authService.loginUser(email, password);
      
      if (!result.success) {
        return res.status(401).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  };
  
  exports.updatePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }
      
      const result = await authService.updatePassword(userId, currentPassword, newPassword);
      
      if (!result.success) {
        return res.status(result.status || 400).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Update password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during password update'
      });
    }
  };
  
  exports.getCurrentUser = async (req, res) => {
    try {
      const userId = req.user.id;
      
      const user = await authService.getUserProfile(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching profile'
      });
    }
  };