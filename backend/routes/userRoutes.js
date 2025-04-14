const express = require('express');
const router = express.Router();
const {userController} = require('../controllers');
const { authenticateUser, adminAccess } = require('../middleware');

router.get('/', authenticateUser, adminAccess, userController.getAllUsers);
router.get('/:id', authenticateUser, adminAccess, userController.getUserById);
router.post('/', authenticateUser, adminAccess, userController.createUser);
router.get('/dashboard/stats', authenticateUser, adminAccess, userController.getDashboardStats);

module.exports = router;