const StoreGuide = require("../models/storeGuideModel");

exports.addStoreGuide = async (req, res) => {
    try {
        const {
          guideName,
          products,
          availableDays,
          cutoffTime,
          user_location,
          _id,
        } = req.body;
        const guideID = _id;
        const newStoreGuide = new StoreGuide({
          guideName,
          guideID,
          products,
          availableDays,
          cutoffTime,
          user_location,
        });
    
        // Save the new store guide to the database
        await newStoreGuide.save();
    
        // Send a success response
        res.json({
          status: "success",
          message: "Store guide added successfully",
          storeGuide: newStoreGuide,
        });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};

exports.getAllStoreGuides = async (req, res) => {
    try {
        const { user_location } = req.params;
    
        // Use Mongoose to find all store guides with the specified user_location
        const allStoreGuides = await StoreGuide.find({ user_location });
        const transformedStoreGuides = allStoreGuides.map((storeGuide) => ({
          _id: storeGuide._id,
          storeGuideName: storeGuide.guideName,
        }));
    
        // Send the list of store guides as a JSON response
        res.json({ status: "success", storeGuides: transformedStoreGuides });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error getting all store guides:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};

exports.getStoreGuideById = async (req, res) => {
    try {
        // Use Mongoose to find the store guide by ID
        const storeGuide = await StoreGuide.findById(req.params.id);
    
        // Check if the store guide with the provided ID exists
        if (!storeGuide) {
          return res
            .status(404)
            .json({ status: "error", message: "Store guide not found" });
        }
    
        // Send the store guide as a JSON response
        res.json({ status: "success", storeGuide });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error getting store guide by ID:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};

exports.deleteStoreGuideById = async (req, res) => {
    try {
        // Use Mongoose to find and remove the store guide by ID
        const deletedStoreGuide = await StoreGuide.findByIdAndDelete(req.params.id);
    
        // Check if the store guide with the provided ID exists
        if (!deletedStoreGuide) {
          return res
            .status(404)
            .json({ status: "error", message: "Store guide not found" });
        }
    
        // Send a success response with the deleted store guide
        res.json({
          status: "success",
          message: "Store guide deleted successfully",
        });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error deleting store guide by ID:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};
