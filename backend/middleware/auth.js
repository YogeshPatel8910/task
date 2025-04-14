const jwt = require('jsonwebtoken');
const {User} = require('../models');

exports.authenticateUser = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({
                success: false,
                message: 'No Token provided'
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findByPk(decoded.id);
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

exports.adminAccess = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(401).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

exports.storeOwnerAccess = (req, res, next) => {
    if(req.user.role !== 'store_owner'){
        return res.status(401).json({
            success: false,
            message: 'Store owner access required'
        });
    }
    next();
};

exports.adminOrStoreOwnerAccess = (req, res, next) => {
    if(req.user.role !== 'admin' && req.user.role !== 'store_owner'){
        return res.status(401).json({
            success: false,
            message: 'Admin or store owner access required'
        });
    }
    next();
};