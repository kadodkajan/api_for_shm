const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeGuideSchema = new Schema({
  guideName: String,
  guideID: String,
  products: [
    {
      ProductId: String,
      productName: String,
      productPar: Number,
    },
  ],
  availableDays: [String],
  cutoffTime: Number,
  user_location: String,
});

const StoreGuide = mongoose.model("StoreGuide", storeGuideSchema);

module.exports = StoreGuide;
