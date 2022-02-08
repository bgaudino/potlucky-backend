const mongoose = require("mongoose");

const comment = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    potluck_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Potluck",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", comment);

module.exports = Comment;
