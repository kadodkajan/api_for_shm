const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');

router.post('/addguide', guideController.addGuide);
router.get('/getAllGuide', guideController.getAllGuides);
router.get('/getGuideById/:id', guideController.getGuideById);
router.delete('/deleteGuideById/:id', guideController.deleteGuideById);

module.exports = router;

