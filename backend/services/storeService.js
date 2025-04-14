const { Store, User, Rating } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

exports.getAllStores = async (name, address, user) => {
  const filter = {};
  
  if (name) filter.name = { [Op.like]: `%${name}%` };
  if (address) filter.address = { [Op.like]: `%${address}%` };
  
  const stores = await Store.findAll({
    where: filter,
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email'],
      }
    ],
    order: [['name', 'ASC']]
  });
  
  if (user.role === 'user') {
    const userRatings = await Rating.findAll({
      where: { UserId: user.id }
    });
    const ratingsMap = {};
    userRatings.forEach(rating => {
      ratingsMap[rating.storeId] = rating.rating;
    });
    return stores.map(store => {
      const storeObj = store.toJSON();
      storeObj.userRating = ratingsMap[store.id] || null;
      return storeObj;
    });
  }
  
  return stores;
};

exports.getStoreById = async (storeId, user = null) => {
  const store = await Store.findByPk(storeId, {
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }
    ]
  });
  
  if (!store) {
    return null;
  }
  
  if (user && user.role === 'user') {
    const userRating = await Rating.findOne({
      where: {
        UserId: user.id,
        StoreId: store.id
      }
    });
    
    const storeObj = store.toJSON();
    storeObj.userRating = userRating ? userRating.rating : null;
    return storeObj;
  }
  
  return store;
};

exports.createStore = async (storeData) => {
  if (storeData.name.length < 3 || storeData.name.length > 50) {
    return {
      success: false,
      message: 'Store name must be between 3 and 50 characters'
    };
  }
  const existingStore = await Store.findOne({
    where: { name: storeData.name }
  });
  
  if (existingStore) {
    return {
      success: false,
      message: 'A store with this name already exists'
    };
  }
  
  const store = await Store.create({
    name: storeData.name,
    address: storeData.address,
    description: storeData.description || '',
    ownerId: storeData.ownerId,
    averageRating: 0,
    totalRatings: 0
  });
  
  return {
    success: true,
    message: 'Store created successfully',
    store
  };
};

exports.updateStore = async (storeId, updateData) => {
  const store = await Store.findByPk(storeId);
  
  if (!store) {
    return {
      success: false,
      status: 404,
      message: 'Store not found'
    };
  }
  
  const fieldsToUpdate = {};
  
  if (updateData.name) {
    if (updateData.name.length < 3 || updateData.name.length > 50) {
      return {
        success: false,
        message: 'Store name must be between 3 and 50 characters'
      };
    }
    
    const existingStore = await Store.findOne({
      where: {
        name: updateData.name,
        id: { [Op.ne]: storeId }
      }
    });
    
    if (existingStore) {
      return {
        success: false,
        message: 'A store with this name already exists'
      };
    }
    
    fieldsToUpdate.name = updateData.name;
  }
  
  if (updateData.address) {
    fieldsToUpdate.address = updateData.address;
  }
  
  if (updateData.description !== undefined) {
    fieldsToUpdate.description = updateData.description;
  }
  
  await store.update(fieldsToUpdate);
  return {
    success: true,
    message: 'Store updated successfully',
    store
  };
};

exports.deleteStore = async (storeId) => {
  const store = await Store.findByPk(storeId);
  if (!store) {
    return {
      success: false,
      status: 404,
      message: 'Store not found'
    };
  }
  await store.destroy();
  
  return {
    success: true,
    message: 'Store deleted successfully'
  };
};

exports.rateStore = async (storeId, userId, rating) => {
  const store = await Store.findByPk(storeId);
  
  if (!store) {
    return {
      success: false,
      status: 404,
      message: 'Store not found'
    };
  }
  const existingRating = await Rating.findOne({
    where: {
      userId: userId,  
      storeId: storeId 
    }
  });
  
  let result;
  
  if (existingRating) {
    await existingRating.update({
      rating
    });
    result = 'updated';
  } else {
    await Rating.create({
      rating,
      userId: userId,   
      storeId: storeId  
    });
    result = 'created';
  }
  
  const updatedStore = await Store.findByPk(storeId);
  const totalRatings = await Rating.count({
    where: { storeId: storeId }
  });
  
  return {
    success: true,
    message: `Rating ${result} successfully`,
    store: {
      id: store.id,
      name: store.name,
      averageRating: updatedStore.averageRating,
      totalRatings: totalRatings
    }
  };
};

exports.getStoreRatings = async (storeId) => {
  const ratings = await Rating.findAll({
    where: { StoreId: storeId },
    include: [
      {
        model: User,
        attributes: ['id', 'name']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  
  return ratings.map(rating => {
    const ratingObj = rating.toJSON();
    ratingObj.User = {
      id: ratingObj.User.id,
      name: ratingObj.User.name
    };
    return ratingObj;
  });
};

exports.getAllRatings = async (userId, storeId, minRating, maxRating) => {
  const filter = {};
  if (userId) filter.userId = userId;
  if (storeId) filter.storeId = storeId;
  if (minRating || maxRating) {
    filter.rating = {};
    if (minRating) filter.rating[Op.gte] = parseInt(minRating);
    if (maxRating) filter.rating[Op.lte] = parseInt(maxRating);
  }
  const ratings = await Rating.findAll({
    where: filter,
    include: [
      {
        model: User,
        attributes: ['id', 'name']
      },
      {
        model: Store,
        attributes: ['id', 'name', 'averageRating']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  return ratings.map(rating => {
    const ratingObj = rating.toJSON();
    if (ratingObj.User) {
      ratingObj.User = {
        id: ratingObj.User.id,
        name: ratingObj.User.name
      };
    }
    return ratingObj;
  });
};