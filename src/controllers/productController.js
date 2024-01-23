const Product = require("../models/productModel");
const ProCat = require("../models/procatModel");

// Define product route handling logic
exports.addProduct = async (req, res) => {
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
      }};

exports.getAllProducts = async (req, res) => {
    try {
        // Use Mongoose to find all products
        const allProduct = await Product.find();
    
        // Send the list of stores as a JSON response
        res.json({ status: "success", product: allProduct });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error getting all catergory:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};

exports.getProductsByCategory = async (req, res) => {
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
      }};

exports.deleteProduct = (req, res) => {
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
      });};
