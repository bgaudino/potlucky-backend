const express = require("express");
const router = express.Router();

const User = require("../models/user");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const users = await User.find({});
  res.send(users);
});

router.post("/", async function (req, res) {
  const { firstName, lastName, email } = req.body;
  const newUser = await User.create({
    firstName,
    lastName,
    email,
  });
  res.send(newUser);
});

router.put("/:id", async function (req, res) {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, {
    firstName,
    lastName,
    email,
  });
  res.send({ message: "User successfully updated", updatedUser });
});

module.exports = router;
