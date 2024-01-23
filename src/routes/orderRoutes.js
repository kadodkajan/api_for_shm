const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/createOrder', orderController.createOrder);

// Get orders based on storeID and date
router.post('/getOrders', orderController.getOrders);

// Get order by ID
router.get('/getOrderById/:id', orderController.getOrderById);

// Delete order by ID
router.delete('/deleteOrderById/:id', orderController.deleteOrderById);

// Update order by ID
router.put('/updateOrderById/:id', orderController.updateOrderById);

// Get future order dates
router.post('/getFutureOrderDates', orderController.getFutureOrderDates);

module.exports = router;
