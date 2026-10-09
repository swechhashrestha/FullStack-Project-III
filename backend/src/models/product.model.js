const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        required: true, 
    min: [1, "Price must be at least 1"] 
  },
    quantity: {
        type: Number,
        default: 1,
    },
    category: {
        type: String,
        default: "Uncategorized"
    },
    cuisine: {
        type: String,
        default: "Continental"
    },
    tags: {
        type: [String],
        default: []
    }
},
{ timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;