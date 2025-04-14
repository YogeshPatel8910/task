const {userService} = require('../services');

exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    
    const users = await userService.getAllUsers(name, email, address, role);
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await userService.getUserById(userId);
    
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
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role, store } = req.body;
    
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    if (role === 'store_owner' && (!store || !store.name || !store.email || !store.address)) {
      return res.status(400).json({
        success: false,
        message: 'Store details are required for store owner role'
      });
    }
    
    const result = await userService.createUser(name, email, password, address, role, store);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user creation'
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, address, role } = req.body;
    const userId = req.params.id;
    
    const result = await userService.updateUser(userId, { name, email, address, role });
    
    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user update'
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await userService.getDashboardStats();
    
    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};