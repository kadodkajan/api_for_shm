
require('dotenv').config();


const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const HTTP_PORT = process.env.PORT || 8080;
const DB = "mongodb+srv://kadodkajan:bVzNQ8UYwLFkhePC@cluster0.5tu5clo.mongodb.net/?retryWrites=true&w=majority"

const cors = require("cors");
const net = require('net');
let dynamicPort = HTTP_PORT;

app.use(cors());

//products



const userSchema = new Schema({
  user_name: String,
  user_id: Number,
  user_auth: String,
  user_role: String,
  user_location: String,
});

let User = mongoose.model("user", userSchema);

app.post("/addUser", async (req, res) => {
  try {
    const { user_name, user_id, user_auth, user_role, user_location } =
      req.body;

    // Check if user_id already exists
    const existingUser = await User.findOne({ user_id });

    if (existingUser) {
      // User with the provided user_id already exists
      return res.status(400).json({
        status: "error",
        message: "User with this user_id already exists",
      });
    }

    // Create a new user if user_id doesn't exist
    const newUser = new User({
      user_name,
      user_id,
      user_auth,
      user_role,
      user_location,
    });

    await newUser.save();

    // Send a success response
    res.json({ status: "success", message: "User added successfully" });
  } catch (error) {
    // Send an error response if an exception occurs
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// DELETE route to remove a user by user_id
app.delete("/deleteUser/:userId", (req, res) => {
  const user_id = req.params.userId;

  // Use Mongoose to find and remove the product by product_id
  User.findOneAndDelete({ user_id: user_id })
    .then((deletedUser) => {
      if (deletedUser) {
        // Product found and deleted successfully
        res.json({ status: "success", message: "User deleted successfully" });
      } else {
        // Product with the given product_id not found
        res.status(404).json({ status: "error", message: "User not found" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    });
});

// GET route to retrieve all users
app.get("/getAllUsers", (req, res) => {
  User.find()
    .then((users) => {
      res.json({ status: "success", users });
    })
    .catch((error) => {
      console.log("error");
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    });
});



app.put("/updateAuth/:userId", async (req, res) => {
  try {
    const { user_auth } = req.body;
    const userId = req.params.userId;

    // Check if the user_role property is present in req.body
    if (!user_auth) {
      return res.status(400).json({
        status: "error",
        message: "User new Password not provided in the request body",
      });
    }

    // Check if the user with the provided userId exists
    const existingUser = await User.findOne({ user_id: userId });

    if (!existingUser) {
      // User with the provided userId does not exist
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Update the user's role
    existingUser.user_user_auth = user_auth;
    await existingUser.save();

    // Send a success response
    res.json({
      status: "success",
      message: "User Password updated successfully",
    });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error updating user Password:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});


//Store
const storeSchema = new Schema({
  storeName: String,
  storeId: Number,
});

let Store = mongoose.model("store", storeSchema);

app.post("/addStore", async (req, res) => {
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
  }
});

// DELETE route to remove a store by storeId
app.delete("/deleteStore/:storeId", (req, res) => {
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
    });
});

// GET route to retrieve all stores
app.get("/getAllStores", async (req, res) => {
  try {
    // Use Mongoose to find all stores
    const allStores = await Store.find();

    // Send the list of stores as a JSON response
    res.json({ status: "success", stores: allStores });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting all stores:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});
app.get("/getAllStoresOnly", async (req, res) => {
  try {
    // Use Mongoose to find all stores
    const allStores = await Store.find({ storeId: { $ne: 0 } });

    // Send the list of stores as a JSON response
    res.json({ status: "success", stores: allStores });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting all stores:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});
//user login

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


//Teams
const teamSchema = new Schema({
  teamName: String
  
});

let Team = mongoose.model("team", teamSchema);

app.post("/addTeam", async (req, res) => {
  try {
    const { teamName } = req.body;

    // Check if storeId already exists
    const existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      // Store with the provided storeId already exists
      return res.status(400).json({
        status: "error",
        message: "Team already exists",
      });
    }

    // Create a new store if storeId doesn't exist
    const newteam = new Team({
      teamName
      
    });

    await newteam.save();

    // Send a success response
    res.json({ status: "success", message: "Team added successfully" });
  } catch (error) {
    // Send an error response if an exception occurs
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// DELETE route to remove a store by storeId
app.delete("/deleteTeam/:teamId", (req, res) => {
  const teamId = req.params.teamId;

  // Use Mongoose to find and remove the store by storeId
  Team.findOneAndDelete({ _id:teamId })
    .then((deletedTeam) => {
      if (deletedTeam) {
        // Store found and deleted successfully
        res.json({ status: "success", message: "Team deleted successfully" });
      } else {
        // Store with the given storeId not found
        res.status(404).json({ status: "error", message: "Team not found" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    });
});

// GET route to retrieve all stores
app.get("/getAllTeam", async (req, res) => {
  try {
    // Use Mongoose to find all stores
    const allTeam = await Team.find();

    // Send the list of stores as a JSON response
    res.json({ status: "success", team: allTeam });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting all Teams:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});


// Product Catergory

const procategorySchema = new Schema({
  procategoryName: String,
  productionTeam: String,
  packingTeam:String
  
});

let ProCat = mongoose.model("procate", procategorySchema);

app.post("/addprocate", async (req, res) => {
  try {
    const { procategoryName,productionTeam,packingTeam } = req.body.procategory;

    const existingcategory = await ProCat.findOne({ procategoryName });

    if (existingcategory) {

      return res.status(400).json({
        status: "error",
        message: "Category already exists",
      });
    }
    const newprocate = new ProCat({
      procategoryName,productionTeam,packingTeam
      
    });

    await newprocate.save();

    // Send a success response
    res.json({ status: "success", message: "Product category added successfully" });
  } catch (error) {
    // Send an error response if an exception occurs
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});
// GET route to retrieve all stores
app.get("/getAllProcat", async (req, res) => {
  try {
    // Use Mongoose to find all stores
    const allProCate = await ProCat.find();

    // Send the list of stores as a JSON response
    res.json({ status: "success", procat: allProCate });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting all catergory:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// DELETE route to remove a store by storeId
app.delete("/deleteprocate/:procatId", (req, res) => {
  const procatId = req.params.procatId;

  ProCat.findOneAndDelete({ _id:procatId })
    .then((deletedProcat) => {
      if (deletedProcat) {
        res.json({ status: "success", message: "Product category deleted successfully" });
      } else {
        res.status(404).json({ status: "error", message: "Product category not found" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    });
});



//Product
const productSchema = new Schema({
  ProductId: String,
  productName: String,
  procategory: procategorySchema  // Embedding procategorySchema as a subdocument
});

const Product = mongoose.model('Product', productSchema);


app.post("/addproduct", async (req, res) => {
  try {
    const { ProductId, productName, procategory } = req.body;

    // Check if the product category already exists
    const existingCategory = await ProCat.findById(procategory);;

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
      procategory: existingCategory  // Assign the procategory information to the product
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
    const products = await Product.find({"procategory._id": catId});

    // Transform each product object to the desired format
    const transformedProducts = products.map(product => ({
      _id:product._id,
      ProductId: product.ProductId,
      productName: product.productName,
      procategory: product.procategory
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

  Product.findOneAndDelete({ _id:productId })
    .then((deletedPro) => {
      if (deletedPro) {
        res.json({ status: "success", message: "Product  deleted successfully" });
      } else {
        res.status(404).json({ status: "error", message: "Product  not found" });
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
      procategory: {procategoryName: String,
        productionTeam: String,
        packingTeam:String}, // Assuming the category is stored as a string, adjust as needed
    }
  ],
  availableDays: [String],
  cutoffTime: {
    hours: String,
    minutes: Number,
    period: String,
  },
});
//Guide
const Guide = mongoose.model('Guide', guideSchema);

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
    res.json({ status: "success", message: "Guide added successfully", guide: newGuide });
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
    const transformedGuides = allGuide.map(guide => ({
      _id:guide._id,
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
      return res.status(404).json({ status: "error", message: "Guide not found" });
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
      return res.status(404).json({ status: "error", message: "Guide not found" });
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
  guideID:String,
  products: [
    {
      ProductId: String,
      productName: String,
      productPar: Number,
    }
  ],
  availableDays: [String],
  cutoffTime: {
    hours: String,
    minutes: Number,
    period: String,
  },
  user_location: String,
});

const StoreGuide = mongoose.model('StoreGuide', storeGuideSchema);

// Add store guide
app.post("/addStoreGuide", async (req, res) => {
  try {
    const { guideName, products, availableDays, cutoffTime, user_location,_id } = req.body;
const guideID=_id;
    const newStoreGuide = new StoreGuide({
      guideName,guideID,
      products,
      availableDays,
      cutoffTime,
      user_location,
    });

    // Save the new store guide to the database
    await newStoreGuide.save();

    // Send a success response
    res.json({ status: "success", message: "Store guide added successfully", storeGuide: newStoreGuide });
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
  const transformedStoreGuides = allStoreGuides.map(storeGuide => ({
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
      return res.status(404).json({ status: "error", message: "Store guide not found" });
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
      return res.status(404).json({ status: "error", message: "Store guide not found" });
    }

    // Send a success response with the deleted store guide
    res.json({ status: "success", message: "Store guide deleted successfully" });
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
      ProductId:String,
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
    }
  ],
});

const Order = mongoose.model('Order', orderSchema);


app.post('/createOrder', async (req, res) => {
  try {
    const { guideID, orderLocation, orderdate,submissionDate, orderOwner, products,guideName } = req.body;
    const orderDate =orderdate;
   
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

    res.json({ status: 'success', message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


app.post('/getOrders', async (req, res) => {
  try {
    const { storeID, date } = req.body;
  
    if (!storeID || !date) {
      return res.status(400).json({ status: 'error', message: 'Missing storeID or date parameter' });
    }

    // Assuming date is in the format YYYY-MM-DD
    const allorders = await Order.find({
      'orderDate': date,
      'orderLocation': storeID,
    });
    const orders = allorders.map(order => ({
      _id:order._id,
      guideName: order.guideName,
      orderdate:order.orderDate,
      orderOwner:order.orderOwner,

     
    }));
    res.json({ status: 'success', orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

class Orderclass {
  constructor({
    guideID,    
    orderDate,
    allproducts,
    storeOrders = [],
  }) {
    this.guideID = guideID;
    this.orderDate = orderDate;
    this.allproducts = allproducts;
    this.storeOrders = storeOrders.map((storeOrder) => new StoreOrderclass(storeOrder));


  }
  addStoreOrder(storeOrderData) {
    const newStoreOrder = new StoreOrderclass(storeOrderData);
    this.storeOrders.push(newStoreOrder);
  }
}

class StoreOrderclass {
  constructor({
   storeId,
    products,
  }) {
    this.storeId = storeId;
        this.products = products.map((product) => new Product(product));
  }
}


class Productclass {
  constructor({
    ProductId,
    productQuantity,
    lastupdate,
  }) {
    this.ProductId = ProductId;
    this.productQuantity = productQuantity;
    this.lastupdate = {
      updatedBy: lastupdate.updatedBy,
      updateDate: new UpdateDate(lastupdate.updateDate),
    };
  }
}

class UpdateDate {
  constructor({ date, time }) {
    this.date = date;
    this.time = time;
  }
}







app.post('/getOrdersForCommisary', async (req, res) => {
  try {
    const { guideID, date } = req.body;

    if (!guideID || !date) {
      return res.status(400).json({ status: 'error', message: 'Missing guideID or date parameter' });
    }

    // Convert guideID to ObjectId

    // Fetch all stores
    const allStores = await Store.find({ storeId: { $ne: 0 } });

    // Fetch orders for each store based on guideID, date, and allStores
    const storeOrdersPromises = allStores.map(async (store) => {
      const storeId = store.storeId; // Adjust the field name accordingly

      // Fetch orders for the current store
      const ordersForStore = await OrderModel.findOne({
        guideID: guideID,
        orderDate: date,
        'products.storeId': storeId,
      });

      return {
        storeId,
        products: ordersForStore ? ordersForStore.products : [],
      };
    });

    // Wait for all store orders to be fetched
    const storeOrders = await Promise.all(storeOrdersPromises);

    // Convert the result to StoreOrderclass instances
    const storeOrderInstances = storeOrders.map((storeOrder) => new StoreOrderclass(storeOrder));

    // You can use the fetched data to initialize the Orderclass
    const orderData = {
      guideID,
      orderDate: date,
      allproducts: [], // You can modify this based on your data structure
      storeOrders: storeOrderInstances,
    };

    const orderInstance = new Orderclass(orderData);

    // Use orderInstance to process or store the orders as needed
    // You can also add more logic here based on your requirements

    res.json({ status: 'success', message: 'Orders fetched successfully', data: orderInstance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});











// Get order by ID
app.get("/getOrderById/:id", async (req, res) => {
  try {
    // Use Mongoose to find the order by ID
    const order = await Order.findById(req.params.id);

    // Check if the order with the provided ID exists
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
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
      return res.status(404).json({ status: "error", message: "Order not found" });
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
      return res.status(400).json({ status: "error", message: "Missing required parameters" });
    }

    // Use Mongoose to find the order by ID
    const order = await Order.findById(_id);

    // Check if the order with the provided ID exists
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    // Update each product in the order's products array
    order.products.forEach((existingProduct) => {
      const updatedProduct = products.find((newProduct) => newProduct.productId === existingProduct.productId);

      if (updatedProduct && updatedProduct.productQuantity !== existingProduct.productQuantity) {
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
    res.json({ status: "success", message: "Order updated successfully", order });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error updating order by ID:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});


app.post('/getFutureOrderDates', async (req, res) => {
  try {
    const { guideID, orderLocation } = req.body;

    if (!guideID || !orderLocation) {
      return res.status(400).json({ status: 'error', message: 'Missing required parameters' });
    }

    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    // Find orders with guideID, orderLocation, and dates greater than or equal to today
    const futureOrderDates = await Order.find({
      'guideID': guideID,
      orderLocation:orderLocation,
      'orderDate': { $gte: formattedCurrentDate },
    }).distinct('orderDate'); // Get distinct date values

    res.json({ status: 'success', futureOrderDates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});












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
app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})
