const express = require("express");
const router = express.Router();

const Comment = require("../models/comment");

router.get("/:potluck_id", async function (req, res) {
  const { potluck_id } = req.params;
  try {
    const comments = await Comment.find({ potluck_id });
    res.send(comments);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: "Error getting comments",
      error: err,
    });
  }
});

router.post("/:potluck_id", async function (req, res) {
  const { potluck_id } = req.params;
  const { displayName, email, body } = req.body;
  try {
    const comment = await Comment.create({
      displayName,
      email,
      body,
      potluck_id,
    });
    res.send(comment);
  } catch (err) {
    res.status(400).send({
      message: "Error creating comment",
      error: err,
    });
  }
});

module.exports = router;
