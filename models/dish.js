const mongoose = require("mongoose");

const categories = ["Appetizers", "Beverages", "Mains", "Desserts", "Extras"];

const dishScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    potluck_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Potluck",
      required: true
    },
    attendee: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String
      }
    },
    category: {
      type: String
    },
    isVegetarian: {
      type: Boolean,
      default: false
    },
    isVegan: {
      type: Boolean,
      default: false
    },
    isGlutenFree: {
      type: Boolean,
      default: false
    },
    isDairyFree: {
      type: Boolean,
      default: false
    },
    isKosher: {
      type: Boolean,
      default: false
    },
    isHalal: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Dish = mongoose.model("Dish", dishScheme);

module.exports = Dish;
