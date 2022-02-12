const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

const unSubscribeSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Unsubscribe = mongoose.model("Unsubscribe", unSubscribeSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  Unsubscribe
};
