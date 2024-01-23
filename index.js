require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const HTTP_PORT = process.env.PORT || 8080;
const DB =
  "mongodb+srv://kadodkajan:bVzNQ8UYwLFkhePC@cluster0.5tu5clo.mongodb.net/?retryWrites=true&w=majority";

const cors = require("cors");
const net = require("net");
let dynamicPort = HTTP_PORT;

app.use(cors());

const userRoutes = require("./src/routes/userRoutes");
app.use("/", userRoutes);

const storeRoutes = require("./src/routes/storeRoutes");
app.use("/", storeRoutes);


const teamRoutes = require("./src/routes/teamRoutes");
app.use("/", teamRoutes);

const procatRoutes = require("./src/routes/procatRoutes");
app.use("/", procatRoutes);



app.post("/login", async (req, res) => {
  try {
    const { user_id, user_auth } = req.body;
    // Find the user by user_id
    const user = await User.findOne({ user_id: user_id });
    if (!user) {
      // User not found
      return res
        .status(404)
        .json({ status: "error", message: "User not founssd" });
    }
    if (String(user.user_auth) === String(user_auth)) {
      // Passwords match
      const { user_id, user_name, user_location } = user; // Extract additional user details

      res.json({
        status: "success",
        message: "Login successful",
        user: { user_id, user_name, user_location },
      });
    } else {
      // Passwords do not match
      res.status(401).json({ status: "error", message: "Incorrect password" });
    }
  } catch (error) {
    // Send an error response if an exception occurs
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});



// Product Catergory







//Product
const productSchema = new Schema({
  ProductId: String,
  productName: String,
  procategory: procategorySchema, // Embedding procategorySchema as a subdocument
});

const Product = mongoose.model("Product", productSchema);

app.post("/addproduct", async (req, res) => {
  try {
    const { ProductId, productName, procategory } = req.body;

    // Check if the product category already exists
    const existingCategory = await ProCat.findById(procategory);

    if (!existingCategory) {
      // If the category does not exist, create a new one
      const newProCat = new ProCat(procategory);
      await newProCat.save();
    }
    const existingProduct = await Product.findOne({ ProductId });

    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        message: "Product with the given productId already exists",
      });
    }

    // Create a new product using the provided information
    const newProduct = new Product({
      ProductId,
      productName,
      procategory: existingCategory, // Assign the procategory information to the product
    });

    await newProduct.save();

    // Send a success response
    res.json({ status: "success", message: "Product added successfully" });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

app.get("/getAllProduct", async (req, res) => {
  try {
    // Use Mongoose to find all stores
    const allProduct = await Product.find();

    // Send the list of stores as a JSON response
    res.json({ status: "success", product: allProduct });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting all catergory:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});
app.get("/getProductbycate/:catId", async (req, res) => {
  try {
    const catId = req.params.catId;
    const products = await Product.find({ "procategory._id": catId });

    // Transform each product object to the desired format
    const transformedProducts = products.map((product) => ({
      _id: product._id,
      ProductId: product.ProductId,
      productName: product.productName,
      procategory: product.procategory,
    }));

    // Send the transformed list of products as a JSON response
    res.json({ status: "success", products: transformedProducts });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting products by category:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// DELETE route to remove
app.delete("/deleteproduct/:productId", (req, res) => {
  const productId = req.params.productId;

  Product.findOneAndDelete({ _id: productId })
    .then((deletedPro) => {
      if (deletedPro) {
        res.json({
          status: "success",
          message: "Product  deleted successfully",
        });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Product  not found" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    });
});

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
      }, // Assuming the category is stored as a string, adjust as needed
    },
  ],
  availableDays: [String],
  cutoffTime: Number,
});
//Guide
const Guide = mongoose.model("Guide", guideSchema);

app.post("/addguide", async (req, res) => {
  try {
    const { guideName, products, availableDays, cutoffTime } = req.body;
    // Create a new guide with the provided information
    const newGuide = new Guide({
      guideName,
      products,
      availableDays,
      cutoffTime,
    });

    // Save the new guide to the database
    await newGuide.save();

    // Send a success response
    res.json({
      status: "success",
      message: "Guide added successfully",
      guide: newGuide,
    });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});
app.get("/getAllGuide", async (req, res) => {
  try {
    // Use Mongoose to find all stores
    const allGuide = await Guide.find();
    const transformedGuides = allGuide.map((guide) => ({
      _id: guide._id,
      guideName: guide.guideName,
    }));
    // Send the list of stores as a JSON response
    res.json({ status: "success", guide: transformedGuides });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting all guide:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});
// Get guide by ID
app.get("/getGuideById/:id", async (req, res) => {
  try {
    // Use Mongoose to find the guide by ID
    const guide = await Guide.findById(req.params.id);

    // Check if the guide with the provided ID exists
    if (!guide) {
      return res
        .status(404)
        .json({ status: "error", message: "Guide not found" });
    }

    // Send the guide as a JSON response
    res.json({ status: "success", guide });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting guide by ID:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// Delete guide by ID
app.delete("/deleteGuideById/:id", async (req, res) => {
  try {
    // Use Mongoose to find and remove the guide by ID
    const deletedGuide = await Guide.findByIdAndDelete(req.params.id);

    // Check if the guide with the provided ID exists
    if (!deletedGuide) {
      return res
        .status(404)
        .json({ status: "error", message: "Guide not found" });
    }

    // Send a success response with the deleted guide
    res.json({ status: "success", message: "Guide  deleted successfully" });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error deleting guide by ID:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

//storeGuideName
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

// Add store guide
app.post("/addStoreGuide", async (req, res) => {
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
  }
});

// Get all store guides
app.get("/getAllStoreGuides/:user_location", async (req, res) => {
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
  }
});

// Get store guide by ID
app.get("/getStoreGuideById/:id", async (req, res) => {
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
  }
});

// Delete store guide by ID
app.delete("/deleteStoreGuideById/:id", async (req, res) => {
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
  }
});

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
      lastupdate: Date,
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

const Order = mongoose.model("Order", orderSchema);

app.post("/createOrder", async (req, res) => {
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
});

app.post("/getOrders", async (req, res) => {
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
  }
});

// Get order by ID
app.get("/getOrderById/:id", async (req, res) => {
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
});

// Delete order by ID
app.delete("/deleteOrderById/:id", async (req, res) => {
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
  }
});

// Update order by ID
app.put("/updateOrderById/:id", async (req, res) => {
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
});

app.post("/getFutureOrderDates", async (req, res) => {
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
});

class Orderclass {
  constructor({ guideID, orderDate, allproducts, storeOrders = [] }) {
    this.guideID = guideID;
    this.orderDate = orderDate;
    this.allproducts = allproducts;
    this.storeOrders = storeOrders.map(
      (storeOrder) => new StoreOrderclass(storeOrder)
    );
  }
  addStoreOrder(storeOrderData) {
    const newStoreOrder = new StoreOrderclass(storeOrderData);
    this.storeOrders.push(newStoreOrder);
  }
}

class StoreOrderclass {
  constructor({ storeName, products, orderOwner }) {
    this.storeName = storeName;
    this.orderOwner = orderOwner;
    this.products = this.mapProducts(products);
  }

  mapProducts(products) {
    // Check if products array is empty before applying map
    return products.length
      ? products.map((product) => new Productclass(product))
      : this.getDefaultProducts(); // Call a method to get default products
  }

  getDefaultProducts() {
    // You can customize this method to return default products or perform other actions
    return [
      new Productclass({
        ProductId: "defaultId",
        productName: "Default Product",
        productQuantity: -1,
        
      }),
    ];
  }
}

class Productclass {
  constructor({ ProductId, productQuantity, lastupdate = {} }) {
    this.ProductId = ProductId;
    this.productQuantity = productQuantity;
    
    if (lastupdate && lastupdate.updatedBy && lastupdate.updateDate) {
      this.lastupdate = {
        updatedBy: lastupdate.updatedBy,
        updateDate: new UpdateDate(lastupdate.updateDate),
      };
    } else {
      this.lastupdate = null; // or any other default value or behavior you want
    }
  }
}

class UpdateDate {
  constructor({ date, time }) {
    this.date = date;
    this.time = time;
  }
}

app.post("/getOrdersForCommisary", async (req, res) => {
  try {
    const { guideID, date } = req.body;

    var message = {
      code: 1,
      message: "all Stores has the orders",
      noPlacedStores: [],
      stores: [],
      systemorder :[],
    };
    if (!guideID || !date) {
      return res.status(400).json({
        status: "error",
        message: "Missing guideID or date parameter",
      });
    }
    const commisaryguide = await Guide.findOne({
      _id: guideID,
    });
    // console.log(commisaryguide);
    const productsForOrder = commisaryguide.products.map((product) => ({
      ProductId: product.ProductId,
      productName: product.productName,
    }));
    // Fetch all stores
    const allStores = await Store.find({ storeId: { $ne: 0 } });

    // Fetch orders for each store based on guideID, date, and allStores
    const storeOrdersPromises = allStores.map(async (store) => {
      const storeName = store.storeName; // Adjust the field name accordingly

      // Fetch orders for the current store
      var ordersForStore = await Order.findOne({
        guideID: guideID,
        orderDate: date,
        orderLocation: storeName,
      });
      if (!ordersForStore) {
        const storeguide = await StoreGuide.findOne({
          guideID: guideID,
          user_location: storeName,
        });
        message.code = 2;
        message.message = "Some Stores did not place the order";
        message.noPlacedStores.push(storeName);
        var productsWithQuantity = [];
        var guideName = "System generated";

        if (!storeguide) {
          guideName = commisaryguide.guideName;
          productsWithQuantity = commisaryguide.products.map((product) => ({
            ProductId: product.ProductId,
            productName: product.productName,
            productQuantity: 0,
            _id: product._id,
          }));
        } else {
          // const productsfororder =storeguide.products;
          guideName = storeguide.guideName;
          productsWithQuantity = storeguide.products.map((product) => ({
            ProductId: product.ProductId,
            productName: product.productName,
            productQuantity: Math.floor(product.productPar / 2),
            _id: product._id,
          }));
        }
        const currentDate = new Date();

        const submissionDate = {
          day: getDayOfWeek(currentDate),
          date: currentDate.toLocaleDateString("en-US"),
          time: currentDate.toLocaleTimeString("en-US"),
        };

        // Function to get the day of the week (Sunday, Monday, etc.)
        function getDayOfWeek(date) {
          const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          return daysOfWeek[date.getDay()];
        }

        const isWithinCutoff = isOrderWithinCutoff(
          date,
          commisaryguide.cutoffTime
        );

        if (isWithinCutoff) {
          message.code = 2;
          message.message =
            "Some Stores did not place the order but they still have the time";
            productsWithQuantity = commisaryguide.products.map((product) => ({
              ProductId: product.ProductId,
              productName: product.productName,
              productQuantity: -1,
              _id: product._id,
            }));
        } else {
          // console.log("Order is outside cutoff time.");
          // console.log(storeName);
          message.code = 3;
          message.message =
            "Some Stores did not place the order yet and the cut off time is over so system will place the order";
          const newOrder = new Order({
            guideID: guideID,
            guideName: guideName,
            orderLocation: storeName,
            orderDate: date,
            submissionDate: submissionDate,
            orderOwner: "System",
            products: productsWithQuantity,
          });
          await newOrder.save();
          ordersForStore = await Order.findOne({
            guideID: guideID,
            orderDate: date,
            orderLocation: storeName,
          });
        }
      } else {
        if (ordersForStore.orderOwner == "System") {

          message.systemorder.push(storeName)

        } else {
          message.stores.push(storeName)
        }
      }

      return {
        storeName,
        orderOwner: ordersForStore ? ordersForStore.orderOwner : "System", // or set a default value
        products: ordersForStore ? ordersForStore.products :productsWithQuantity,
      };
    });
    // Wait for all store orders to be fetched
    const storeOrders = await Promise.all(storeOrdersPromises);
    // Convert the result to StoreOrderclass instances
    const storeOrderInstances = storeOrders.map(
      (storeOrder) => new StoreOrderclass(storeOrder)
    );
    // You can use the fetched data to initialize the Orderclass
    const orderData = {
      guideID,
      orderDate: date,
      allproducts: productsForOrder, // You can modify this based on your data structure
      storeOrders: storeOrderInstances,
    };

    const orderInstance = new Orderclass(orderData);

    // Use orderInstance to process or store the orders as needed
    // You can also add more logic here based on your requirements

    res.json({
      status: "success",
      message: {
        text: "Orders fetched successfully",
        details: message
      },
            data: orderInstance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});
function isOrderWithinCutoff(date, cutoffTime) {
  const orderDate = new Date(`${date} 00:00:00`);
  const torontoTimeZone = "America/Toronto";
  const dateInToronto = new Date().toLocaleDateString("en-US", {
    timeZone: torontoTimeZone,
  });
  const timeInToronto = new Date().toLocaleTimeString("en-US", {
    timeZone: torontoTimeZone,
  });

  // Parse date and time strings to create a Date object for current date and time
  const currentDateTime = new Date(`${dateInToronto} ${timeInToronto}`);

  // Calculate the time difference in milliseconds
  const diff = orderDate.getTime() - currentDateTime.getTime();

  // Convert the time difference to hours
  const hoursDifference = Math.floor(diff / 1000 / 60 / 60);

  // Check if the order is within the cutoff time
  return cutoffTime < hoursDifference;
}

mongoose
  .connect(DB)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Start the server on an available port
app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});
