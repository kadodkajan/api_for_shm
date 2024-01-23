const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guideSchema = new Schema({
  guideName: String,
  products: [
    {
      ProductId: String,
      productName: String,
      procategory: {
        procategoryName: String,
        productionTeam: String,
        packingTeam: String,
      }, 
    },
  ],
  availableDays: [String],
  cutoffTime: Number,
});
//Guide
const Guide = mongoose.model("Guide", guideSchema);
module.exports = Guide;

