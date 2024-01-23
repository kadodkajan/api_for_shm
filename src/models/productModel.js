const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  ProductId: String,
  productName: String,
  procategory: {
    procategoryName: String,
    productionTeam: String,
    packingTeam: String,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

