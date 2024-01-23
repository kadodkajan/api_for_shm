const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// Define team routes
router.post("/addTeam", teamController.addTeam);
router.delete("/deleteTeam/:teamId", teamController.deleteTeam);
router.get("/getAllTeams", teamController.getAllTeams);

// Export the router
module.exports = router;
