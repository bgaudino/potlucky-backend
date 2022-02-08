const express = require("express");
const router = express.Router();

const Comment = require("../models/comment");

router.get("/:potluck_id", async function (req, res) {
  const { potluck_id } = req.params;
  try {
    const comments = await Comment.findMany({ potluck_id });
    res.send(comments);
  } catch (err) {
    res.status(400).send({
      message: "Error getting comments",
      error: err,
    });
  }
});
