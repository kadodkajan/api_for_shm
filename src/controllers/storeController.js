const Store = require("../models/storeModel");

// Define store route handling logic
exports.addStore = async (req, res) => {
    try {
        const { storeName, storeId } = req.body;
    
        // Check if storeId already exists
        const existingStore = await Store.findOne({ storeId });
    
        if (existingStore) {
          // Store with the provided storeId already exists
          return res.status(400).json({
            status: "error",
            message: "Store with this storeId already exists",
          });
        }
    
        // Create a new store if storeId doesn't exist
        const newStore = new Store({
          storeName,
          storeId,
        });
    
        await newStore.save();
    
        // Send a success response
        res.json({ status: "success", message: "Store added successfully" });
      } catch (error) {
        // Send an error response if an exception occurs
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};

exports.deleteStore = (req, res) => {
    const storeId = req.params.storeId;

    // Use Mongoose to find and remove the store by storeId
    Store.findOneAndDelete({ storeId })
      .then((deletedStore) => {
        if (deletedStore) {
          // Store found and deleted successfully
          res.json({ status: "success", message: "Store deleted successfully" });
        } else {
          // Store with the given storeId not found
          res.status(404).json({ status: "error", message: "Store not found" });
        }
      })
      .catch((error) => {
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      });};

exports.getAllStores = async (req, res) => {
    try {
        // Use Mongoose to find all stores
        const allStores = await Store.find();
    
        // Send the list of stores as a JSON response
        res.json({ status: "success", stores: allStores });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error getting all stores:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};

exports.getAllStoresOnly = async (req, res) => {
    try {
        // Use Mongoose to find all stores
        const allStores = await Store.find({ storeId: { $ne: 0 } });
    
        // Send the list of stores as a JSON response
        res.json({ status: "success", stores: allStores });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error getting all stores:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};
