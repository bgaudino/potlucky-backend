const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

const Potluck = require("../models/potluck");
const Dish = require("../models/dish");

router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const potluck = await Potluck.findById(id);
    if (!potluck) {
      return res.status(404).send({
        message: "Potluck not found"
      });
    }
    const dishes = await Dish.find({ potluck_id: id });
    return res.send({
      potluck,
      dishes
    });
  } catch (err) {
    return res.send({
      message: "Potluck not found",
      error: err
    });
  }
});

router.post("/create", async function (req, res, next) {
  const { name, description, date, location, host } = req.body;
  try {
    const newPotluck = await Potluck.create({
      name,
      description,
      date,
      location,
      host
    });
    return res.json(newPotluck);
  } catch (err) {
    return res.status(400).send({
      message: "Potluck not created",
      error: err
    });
  }
});

router.post("/dishes", async function (req, res, next) {
  const { name, description, category, potluck_id, attendee } = req.body;
  try {
    const duplicateDish = await Dish.findOne({ name, potluck_id });
    if (duplicateDish) {
      console.log("Dish already exists");
      return res.status(400).send({
        message: "Someone is already bring this dish"
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: "Potluck not created",
      error: err
    });
  }

  try {
    const newDish = await Dish.create({
      name,
      potluck_id,
      attendee,
      description,
      category
    });
    return res.json(newDish);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: "Dish not created",
      error: err
    });
  }
});

router.put("/dishes/:id", async function (req, res, next) {
  const { id } = req.params;
  const { name, description, potluck_id, attendee, category } = req.body;
  try {
    const dish = await Dish.findById(id);
    if (!dish) {
      return res.status(404).send({
        message: "Dish not found"
      });
    }
    const updatedDish = await Dish.findByIdAndUpdate(id, {
      name,
      potluck_id,
      attendee,
      description,
      category
    });
    const newData = await Dish.findById(id);
    return res.json(newData);
  } catch (err) {
    return res.status(400).send({
      message: "Dish not updated",
      error: err
    });
  }
});

router.delete("/dishes/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const dish = await Dish.findById(id);
    if (!dish) {
      return res.status(404).send({
        message: "Dish not found"
      });
    }
    const deletedDish = await Dish.findByIdAndDelete(id);
    return res.json(deletedDish);
  } catch (err) {
    return res.status(400).send({
      message: "Dish not deleted",
      error: err
    });
  }
});

module.exports = router;
