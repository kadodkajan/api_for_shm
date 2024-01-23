const ProCat = require("../models/procatModel");

// Define product category route handling logic
exports.addProCat = async (req, res) => {
    try {
        const { procategoryName, productionTeam, packingTeam } =
          req.body.procategory;
    
        const existingcategory = await ProCat.findOne({ procategoryName });
    
        if (existingcategory) {
          return res.status(400).json({
            status: "error",
            message: "Category already exists",
          });
        }
        const newprocate = new ProCat({
          procategoryName,
          productionTeam,
          packingTeam,
        });
    
        await newprocate.save();
    
        // Send a success response
        res.json({
          status: "success",
          message: "Product category added successfully",
        });
      } catch (error) {
        // Send an error response if an exception occurs
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};

exports.getAllProCate = async (req, res) => {
    try {
        // Use Mongoose to find all stores
        const allProCate = await ProCat.find();
    
        // Send the list of stores as a JSON response
        res.json({ status: "success", procat: allProCate });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error getting all catergory:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};

exports.deleteProCat = (req, res) => {
    const procatId = req.params.procatId;

    ProCat.findOneAndDelete({ _id: procatId })
      .then((deletedProcat) => {
        if (deletedProcat) {
          res.json({
            status: "success",
            message: "Product category deleted successfully",
          });
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Product category not found" });
        }
      })
      .catch((error) => {
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      });};
