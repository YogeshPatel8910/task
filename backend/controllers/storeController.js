const storeService = require('../services/storeService');

exports.getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const user = req.user;
    
    const result = await storeService.getAllStores(name, address, user);
    
    res.status(200).json({
      success: true,
      count: result.length,
      stores: result
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stores'
    });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const storeId = req.params.id;
    const user = req.user;
    
    const store = await storeService.getStoreById(storeId, user);
    
    if (!store) {
      return res.status(401).json({
        success: false,
        message: 'Store not found'
      });
    }
    
    res.status(200).json({
      success: true,
      store
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching store'
    });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, address, description } = req.body;
    const user = req.user;
    
    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: 'Name and address are required'
      });
    }
    
    if (user.role !== 'admin' && user.role !== 'store_owner') {
      return res.status(403).json({
        success: false,
        message: 'Only admin or store owners can create stores'
      });
    }
    
    const result = await storeService.createStore({
      name,
      address,
      description,
      ownerId: user.id
    });
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during store creation'
    });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const { name, address, description } = req.body;
    const storeId = req.params.id;
    const user = req.user;
    
    const store = await storeService.getStoreById(storeId);
    
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }
    
    if (user.role !== 'admin' && store.owner.id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this store'
      });
    }
    
    const result = await storeService.updateStore(storeId, {
      name,
      address,
      description
    });
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during store update'
    });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const storeId = req.params.id;
    
    const store = await storeService.getStoreById(storeId);
    
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }
    
    const result = await storeService.deleteStore(storeId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during store deletion'
    });
  }
};

exports.rateStore = async (req, res) => {
  try {
    const { rating } = req.body; 
    const storeId = req.params.id;
    const user = req.user;
    
    if (user.role !== 'user') { 
      return res.status(403).json({
        success: false,
        message: 'Only normal users can rate stores'
      });
    }
    
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5'
      });
    }
    
    const result = await storeService.rateStore(storeId, user.id, rating);
    
    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Rate store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during store rating'
    });
  }
};

exports.getStoreRatings = async (req, res) => {
  try {
    const storeId = req.params.id;
    
    const store = await storeService.getStoreById(storeId);
    
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }
    
    const ratings = await storeService.getStoreRatings(storeId);
    
    res.status(200).json({
      success: true,
      count: ratings.length,
      ratings
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching store ratings'
    });
  }
};
exports.getAllRatings = async (req, res) => {
  try {
    const { userId, storeId, minRating, maxRating } = req.query;
    const user = req.user;
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin users can view all ratings'
      });
    }
    
    const result = await storeService.getAllRatings(userId, storeId, minRating, maxRating);
    
    res.status(200).json({
      success: true,
      count: result.length,
      ratings: result
    });
  } catch (error) {
    console.error('Get all ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching ratings'
    });
  }
};