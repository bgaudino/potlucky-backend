const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const Potluck = require("../models/potluck");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
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
  const body = `
    <div style="background: #3f51b5; color: #fff; text-align: center; padding: 20px;">
    <h1>Potlucky 🍯</h1>
    <h2>Party! ${sender_name} has invited you to a potluck on ${new Date(
    potluck.date
  ).toLocaleString()}.</h2>
    <h3>
    <a style="color: orange;" href="http://localhost:3000/potlucks/${
      potluck.id
    }">Click here</a> to see what people are bringing.
    </h3>
    <img style="width: 300px; height: auto;" src="https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="potluck" style="width: 100%; height: auto;">
    </div>`;
  return body;
}

module.exports = router;
