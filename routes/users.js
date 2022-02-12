const express = require("express");
const router = express.Router();

const { User, Unsubscribe } = require("../models/user");

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
    email
  });
  res.send(newUser);
});

router.get("/unsubscribe", async function (req, res) {
  const { email } = req.query;
  try {
    const alreadyUnsubscribed = await Unsubscribe.find({ email });
    console.log(alreadyUnsubscribed);
    if (!alreadyUnsubscribed || alreadyUnsubscribed.length === 0) {
      const newUnsubscribe = await Unsubscribe.create({
        email
      });
      console.log(newUnsubscribe);
    }
  } catch (err) {
    console.log(err);
  }

  res.send("You have been unsubscribed");
});

router.put("/:id", async function (req, res) {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, {
    firstName,
    lastName,
    email
  });
  res.send({ message: "User successfully updated", updatedUser });
});

module.exports = router;
