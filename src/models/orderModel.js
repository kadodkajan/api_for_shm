const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  guideID: String,
  guideName: String,
  orderLocation: String,
  orderDate: String,
  submissionDate: {
    day: String,
    date: String,
    time: String,
  },
  orderOwner: String,
  products: [
    {
      ProductId: String,
      productName: String,
      productQuantity: Number,
      lastupdate: {
        updatedBy: String,
        updateDate: {
          date: String,
          time: String,
        },
      },
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
