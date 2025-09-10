const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  description: { type: String },
  image: { type: String } // will store image URL or path
});

module.exports = mongoose.model("Product", productSchema);
