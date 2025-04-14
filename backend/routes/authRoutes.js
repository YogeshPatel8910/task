const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { authenticateUser } = require('../middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update-password', authenticateUser, authController.updatePassword);
router.get('/me', authenticateUser, authController.getCurrentUser);

module.exports = router;