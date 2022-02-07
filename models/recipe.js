const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  dish_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dish",
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Recipe", recipeSchema);