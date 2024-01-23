const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define routes
router.post("/addUser", userController.addUser);
router.delete("/deleteUser/:userId", userController.deleteUser);
router.get("/getAllUsers", userController.getAllUsers);

// Export the router
module.exports = router;
