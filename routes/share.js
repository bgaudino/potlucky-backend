const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const getEmailBody = require("../utils/email");

const Potluck = require("../models/potluck");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

router.post("/", async function (req, res) {
  const { sender_name, recipient_email, potluckId } = req.body;
  console.log(req.body);
  try {
    const potluck = await Potluck.findById(potluckId);
    if (!potluck) return res.status(404).send({ message: "Potluck not found" });
    sendEmail(sender_name, recipient_email, potluck);
    return res.send({ message: "Email sent" });
  } catch (err) {
    console.log(err);
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
      html: getEmailBody(sender_name, recipient_email, potluck)
    });
    console.log("Message sent: %s", info.messageId);
    return { message: "Message sent" };
  } catch (err) {
    console.log("Message not sent", err);
    return { message: "Message not sent", error: err };
  }
}

module.exports = router;
