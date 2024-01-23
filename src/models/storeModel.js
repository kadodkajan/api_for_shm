const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the store schema
const storeSchema = new Schema({
  storeName: String,
  storeId: Number,
});

// Create the Store model
const Store = mongoose.model("store", storeSchema);

// Export the Store model
module.exports = Store;
