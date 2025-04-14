const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateUser, adminAccess } = require('../middleware');

router.get('/', authenticateUser, storeController.getAllStores);
router.get('/allratings', authenticateUser, adminAccess, storeController.getAllRatings);
router.get('/:id', authenticateUser, storeController.getStoreById);
router.post('/', authenticateUser, storeController.createStore);
router.put('/:id', authenticateUser, storeController.updateStore);
router.delete('/:id', authenticateUser, adminAccess, storeController.deleteStore);
router.post('/:id/ratings', authenticateUser, storeController.rateStore);
router.get('/:id/ratings', authenticateUser, storeController.getStoreRatings);


module.exports = router;