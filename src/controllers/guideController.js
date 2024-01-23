const Guide = require('../models/guideModel');

exports.addGuide = async (req, res) => {
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
  }};

exports.getAllGuides = async (req, res) => {
  try {
    // Use Mongoose to find all 
    const allGuide = await Guide.find();
    const transformedGuides = allGuide.map((guide) => ({
      _id: guide._id,
      guideName: guide.guideName,
    }));
    // Send the list of  as a JSON response
    res.json({ status: "success", guide: transformedGuides });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting all guide:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }};

exports.getGuideById = async (req, res) => {
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
  }};

exports.deleteGuideById = async (req, res) => {
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
  }};

