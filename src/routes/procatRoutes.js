const express = require("express");
const router = express.Router();
const procatController = require("../controllers/procatController");

// Define product category routes
router.post("/addprocate", procatController.addProCat);
router.get("/getAllProcat", procatController.getAllProCate);
router.delete("/deleteprocate/:procatId", procatController.deleteProCat);

// Export the router
module.exports = router;
