const nodemailer = require('nodemailer');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const mailRouter = express.Router();

let transporter = nodemailer.createTransport({
  host: process.env.HOST_EMAIL,
  port: process.env.PORT_EMAIL,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_EMAIL,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take message');
  }
});

mailRouter.post('/contact', async (req, res) => {
  let mail = {
    from: req.body.email,
    to: process.env.USER_EMAIL,
    subject: `${req.body.name} te-a contactat`,
    text: req.body.message,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.log(error);
  }
});

module.exports = { mailRouter };
