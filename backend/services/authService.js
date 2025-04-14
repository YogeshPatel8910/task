const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User , Store } = require('../models');

exports.registerUser = async (name, email, password, address) => {
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
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    address,
    role: 'user'
  });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRET,
    { expiresIn: '1d' }
  );

  return {
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return {
      success: false,
      message: 'Invalid credentials'
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      success: false,
      message: 'Invalid credentials'
    };
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRET,
    { expiresIn: '1d' }
  );

  return {
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

exports.updatePassword = async (userId, currentPassword, newPassword) => {
  if (newPassword.length < 8 || newPassword.length > 16) {
    return {
      success: false,
      message: 'Password must be between 8 and 16 characters'
    };
  }

  if (!/[A-Z]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    return {
      success: false,
      message: 'Password must contain at least one uppercase letter and one special character'
    };
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return {
      success: false,
      status: 404,
      message: 'User not found'
    };
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return {
      success: false,
      status: 401,
      message: 'Current password is incorrect'
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await user.update({ password: hashedPassword });

  return {
    success: true,
    message: 'Password updated successfully'
  };
};

exports.getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  
  if (!user) {
    return null;
  }
  
  if (user.role === 'store_owner') {
    const store = await Store.findOne({
      where: { ownerId: userId }
    });
    
    return {
      ...user.toJSON(),
      store: store ? store.toJSON() : null
    };
  }
  
  return user;
};