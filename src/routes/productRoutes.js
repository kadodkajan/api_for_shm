const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Define product routes
router.post("/addproduct", productController.addProduct);
router.get("/getAllProduct", productController.getAllProducts);
router.get("/getProductbycate/:catId", productController.getProductsByCategory);
router.delete("/deleteproduct/:productId", productController.deleteProduct);

// Export the router
module.exports = router;
