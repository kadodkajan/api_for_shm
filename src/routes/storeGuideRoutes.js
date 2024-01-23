const express = require('express');
const router = express.Router();
const storeGuideController = require('../controllers/storeGuideController');

// Route to add a new store guide
router.post('/addStoreGuide', storeGuideController.addStoreGuide);

// Route to get all store guides for a specific location
router.get('/getAllStoreGuides/:user_location', storeGuideController.getAllStoreGuides);

// Route to get a store guide by ID
router.get('/getStoreGuideById/:id', storeGuideController.getStoreGuideById);

// Route to delete a store guide by ID
router.delete('/deleteStoreGuideById/:id', storeGuideController.deleteStoreGuideById);

module.exports = router;
