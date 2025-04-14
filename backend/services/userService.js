const bcrypt = require('bcrypt');
const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

exports.getAllUsers = async (name, email, address, role) => {
  const filter = {};
  if (name) filter.name = { [Op.like]: `%${name}%` };
  if (email) filter.email = { [Op.like]: `%${email}%` };
  if (address) filter.address = { [Op.like]: `%${address}%` };
  if (role) filter.role = role;
  
  const users = await User.findAll({
    where: filter,
    attributes: { exclude: ['password'] },
    order: [['id', 'ASC']],
    include: [
      {
        model: Store,
        as: 'Store',
        attributes: ['id', 'name','email' ,'address', 'averageRating'],
        required: false
      }
    ]
  });
  
  return users;
};

exports.getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Store,
        as: 'Store',
        attributes: ['id', 'name','email' ,'address', 'averageRating'],
        required: false
      }
    ]
  });
  
  return user;
};

exports.createUser = async (name, email, password, address, role, storeData = null) => {
  if (name.length < 20 || name.length > 60) {
    return {
      success: false,
      message: 'Name must be between 20 and 60 characters'
    };
  }

  if (address.length > 400) {
    return {
      success: false,
      message: 'Address must not exceed 400 characters'
    };
  }

  if (password.length < 8 || password.length > 16) {
    return {
      success: false,
      message: 'Password must be between 8 and 16 characters'
    };
  }

  if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      success: false,
      message: 'Password must contain at least one uppercase letter and one special character'
    };
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return {
      success: false,
      message: 'Email already registered'
    };
  }

  if (role === 'store_owner') {
    if (!storeData || !storeData.name || !storeData.email || !storeData.address) {
      return {
        success: false,
        message: 'Store details are required for store owner role'
      };
    }

    if (storeData.name.length < 20 || storeData.name.length > 60) {
      return {
        success: false,
        message: 'Store name must be between 20 and 60 characters'
      };
    }

    if (storeData.address.length > 400) {
      return {
        success: false,
        message: 'Store address must not exceed 400 characters'
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(storeData.email)) {
      return {
        success: false,
        message: 'Please enter a valid store email address'
      };
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const result = await User.sequelize.transaction(async (transaction) => {
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        address,
        role
      }, { transaction });

      if (role === 'store_owner' && storeData) {
        await Store.create({
          name: storeData.name,
          email: storeData.email,
          address: storeData.address,
          ownerId: user.id
        }, { transaction });
      }

      return user;
    });

    const userData = result.toJSON();
    delete userData.password;

    return {
      success: true,
      message: 'User created successfully',
      user: userData
    };
  } catch (error) {
    console.error('User creation error:', error);
    return {
      success: false,
      message: 'Server error during user creation'
    };
  }
}

exports.updateUser = async (userId, updateData) => {
  let user = await User.findByPk(userId);
  if (!user) {
    return {
      success: false,
      status: 404,
      message: 'User not found'
    };
  }
  
  const fieldsToUpdate = {};
  
  if (updateData.name) {
    if (updateData.name.length < 20 || updateData.name.length > 60) {
      return {
        success: false,
        message: 'Name must be between 20 and 60 characters'
      };
    }
    fieldsToUpdate.name = updateData.name;
  }
  
  if (updateData.email) {
    const existingUser = await User.findOne({
      where: {
        email: updateData.email,
        id: { [Op.ne]: userId }
      }
    });
    
    if (existingUser) {
      return {
        success: false,
        message: 'Email already registered to another user'
      };
    }
    
    fieldsToUpdate.email = updateData.email;
  }
  
  if (updateData.address) {
    if (updateData.address.length > 400) {
      return {
        success: false,
        message: 'Address must not exceed 400 characters'
      };
    }
    fieldsToUpdate.address = updateData.address;
  }
  
  if (updateData.role) {
    if (!['admin', '    ', 'store_owner'].includes(updateData.role)) {
      return {
        success: false,
        message: 'Invalid role. Role must be admin, user, or store_owner'
      };
    }
    fieldsToUpdate.role = updateData.role;
  }
  
  await user.update(fieldsToUpdate);
  
  return {
    success: true,
    message: 'User updated successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    }
  };
};

exports.getDashboardStats = async () => {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();
  
  return {
    totalUsers,
    totalStores,
    totalRatings
  };
};