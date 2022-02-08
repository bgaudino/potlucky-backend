const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

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
        message: "Potluck not found",
      });
    }
    const dishes = await Dish.find({ potluck_id: id });
    return res.send({
      potluck,
      dishes,
    });
  } catch (err) {
    return res.send({
      message: "Potluck not found",
      error: err,
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
      host,
    });
    return res.json(newPotluck);
  } catch (err) {
    return res.status(400).send({
      message: "Potluck not created",
      error: err,
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
        message: "Someone is already bring this dish",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: "Potluck not created",
      error: err,
    });
  }

  try {
    const newDish = await Dish.create({
      name,
      potluck_id,
      attendee,
      description,
      category,
    });
    return res.json(newDish);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: "Dish not created",
      error: err,
    });
  }
});

router.put("/dishes/:id", async function (req, res, next) {
  const { id } = req.params;
  const { name, description, potluck_id, attendee } = req.body;
  try {
    const dish = await Dish.findById(id);
    if (!dish) {
      return res.status(404).send({
        message: "Dish not found",
      });
    }
    const updatedDish = await Dish.findByIdAndUpdate(id, {
      name,
      potluck_id,
      attendee,
      description,
    });
    return res.json(updatedDish);
  } catch (err) {
    return res.status(400).send({
      message: "Dish not updated",
      error: err,
    });
  }
});

router.delete("/dishes/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const dish = await Dish.findById(id);
    if (!dish) {
      return res.status(404).send({
        message: "Dish not found",
      });
    }
    const deletedDish = await Dish.findByIdAndDelete(id);
    return res.json(deletedDish);
  } catch (err) {
    return res.status(400).send({
      message: "Dish not deleted",
      error: err,
    });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post("/share", async function (req, res) {
  const { sender_name, recipient_email, potluckId } = req.body;
  console.log(req.body);
  try {
    const potluck = await Potluck.findById(potluckId);
    if (!potluck) return res.status(404).send({ message: "Potluck not found" });
    sendEmail(sender_name, recipient_email, potluck);
    return res.send({ message: "Email sent" });
  } catch (err) {
    return res.status(400).send({ message: "Potluck not found", error: err });
  }
});

async function sendEmail(sender_name, recipient_email, potluck) {
  console.log(recipient_email);
  try {
    const info = await transporter.sendMail({
      from: `Potlucky <${process.env.EMAIL}>`,
      to: recipient_email,
      subject: `${sender_name} has invited you to a potluck!`,
      html: getEmailBody(sender_name, recipient_email, potluck),
    });
    console.log("Message sent: %s", info.messageId);
    return { message: "Message sent" };
  } catch (err) {
    console.log("Message not sent", err);
    return { message: "Message not sent", error: err };
  }
}

function getEmailBody(sender_name, recipient_email, potluck) {
  return `Party! ${sender_name} has invited you to a potluck on ${new Date(
    potluck.date
  ).toLocaleString()}.
  Check it out <a href="http://localhost:3000/potlucks/${
    potluck._id
  }">here on Potlucky</a>, to see
  what guests are bringing what dishes.`;
}

module.exports = router;
