const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

// Define store routes
router.post("/addStore", storeController.addStore);
router.delete("/deleteStore/:storeId", storeController.deleteStore);
router.get("/getAllStores", storeController.getAllStores);
router.get("/getAllStoresOnly", storeController.getAllStoresOnly);

// Export the router
module.exports = router;
