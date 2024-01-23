const express = require("express");
const router = express.Router();
const comOrderController = require("../controllers/comOrderController");

// Define team routes

router.get("/getOrdersForCommisary", comOrderController.getOrdersForCommisary);

// Export the router
module.exports = router;