const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the product category schema
const procategorySchema = new Schema({
  procategoryName: String,
  productionTeam: String,
  packingTeam: String,
});

// Create the ProCat model
const ProCat = mongoose.model("procate", procategorySchema);

// Export the ProCat model
module.exports = ProCat;
