const Product = require("../models/product.model");
const uploadOnCloudinary = require("../utils/cloudinary");

const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, cuisine, tags } = req.body;

    let imageUrl = null;

    if (req?.file?.path) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult?.secure_url) {
        imageUrl = uploadResult.secure_url;
      }
    }

    let parsedTags = tags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags.split(",").map((t) => t.trim());
      }
    }

    const product = await Product.create({
      title,
      description,
      price,
      image: imageUrl,
      category: category || "Uncategorized",
      cuisine: cuisine || "American",
      tags: parsedTags || [],
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const fetchProducts = async (req, res) => {
  try {
    const { cuisine } = req.query;

    let queryFilter = {};
    if (cuisine && cuisine !== "All") {
      queryFilter.cuisine = { $regex: new RegExp(`^${cuisine}$`, "i") };
    }

    const products = await Product.find(queryFilter).sort({ createdAt: -1 });

    if (products.length === 0) {
      return res.status(200).json({
        message: "No products found",
        products: [],
      });
    }

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, cuisine, tags } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (price) updateData.price = price;
  if (category) updateData.category = category;
  if (cuisine) updateData.cuisine = cuisine;

  if (tags) {
    if (typeof tags === "string") {
      try {
        updateData.tags = JSON.parse(tags);
      } catch {
        updateData.tags = tags.split(",").map((t) => t.trim());
      }
    } else {
      updateData.tags = tags;
    }
  }

  try {
    if (req?.file?.path) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult?.secure_url) {
        updateData.image = uploadResult.secure_url;
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  fetchProducts,
  deleteProduct,
  getProduct,
  editProduct,
};