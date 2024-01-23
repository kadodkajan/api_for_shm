const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
    try {
        const {
          guideID,
          orderLocation,
          orderdate,
          submissionDate,
          orderOwner,
          products,
          guideName,
        } = req.body;
        const orderDate = orderdate;
    
        const newOrder = new Order({
          guideID,
          guideName,
          orderLocation,
          orderDate,
          submissionDate,
          orderOwner,
          products,
        });
    
        await newOrder.save();
    
        res.json({
          status: "success",
          message: "Order created successfully",
          order: newOrder,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }
};

exports.getOrders = async (req, res) => {
    try {
        const { storeID, date } = req.body;
    
        if (!storeID || !date) {
          return res.status(400).json({
            status: "error",
            message: "Missing storeID or date parameter",
          });
        }
    
        // Assuming date is in the format YYYY-MM-DD
        const allorders = await Order.find({
          orderDate: date,
          orderLocation: storeID,
        });
        const orders = allorders.map((order) => ({
          _id: order._id,
          guideName: order.guideName,
          orderdate: order.orderDate,
          orderOwner: order.orderOwner,
        }));
        res.json({ status: "success", orders });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }  // ...
};

exports.getOrderById = async (req, res) => {
    try {
        // Use Mongoose to find the order by ID
        const order = await Order.findById(req.params.id);
    
        // Check if the order with the provided ID exists
        if (!order) {
          return res
            .status(404)
            .json({ status: "error", message: "Order not found" });
        }
    
        // Send the order as a JSON response
        res.json({ status: "success", order });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error getting order by ID:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }
};

exports.deleteOrderById = async (req, res) => {
    try {
        // Use Mongoose to find and remove the order by ID
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    
        // Check if the order with the provided ID exists
        if (!deletedOrder) {
          return res
            .status(404)
            .json({ status: "error", message: "Order not found" });
        }
    
        // Send a success response with the deleted order
        res.json({ status: "success", message: "Order deleted successfully" });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error deleting order by ID:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }  // ...
};

exports.updateOrderById = async (req, res) => {
    try {
        const { _id, products, updatedate, updateby } = req.body;
    
        // Validate required fields
        if (!_id || !products || !updatedate || !updateby) {
          return res
            .status(400)
            .json({ status: "error", message: "Missing required parameters" });
        }
    
        // Use Mongoose to find the order by ID
        const order = await Order.findById(_id);
    
        // Check if the order with the provided ID exists
        if (!order) {
          return res
            .status(404)
            .json({ status: "error", message: "Order not found" });
        }
    
        // Update each product in the order's products array
        order.products.forEach((existingProduct) => {
          const updatedProduct = products.find(
            (newProduct) => newProduct.productId === existingProduct.productId
          );
    
          if (
            updatedProduct &&
            updatedProduct.productQuantity !== existingProduct.productQuantity
          ) {
            // Update only if the quantities are different
            existingProduct.productQuantity = updatedProduct.productQuantity;
            existingProduct.lastupdate = {
              updatedBy: updateby,
              updateDate: updatedate,
            };
          }
        });
    
        // Save the updated order
        await order.save();
    
        // Send a success response with the updated order
        res.json({
          status: "success",
          message: "Order updated successfully",
          order,
        });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error updating order by ID:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }
};

exports.getFutureOrderDates = async (req, res) => {
    try {
        const { guideID, orderLocation } = req.body;
    
        if (!guideID || !orderLocation) {
          return res
            .status(400)
            .json({ status: "error", message: "Missing required parameters" });
        }
    
        const currentDate = new Date();
        const formattedCurrentDate = currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
    
        // Find orders with guideID, orderLocation, and dates greater than or equal to today
        const futureOrderDates = await Order.find({
          guideID: guideID,
          orderLocation: orderLocation,
          orderDate: { $gte: formattedCurrentDate },
        }).distinct("orderDate"); // Get distinct date values
    
        res.json({ status: "success", futureOrderDates });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }
};
