const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');
const http = require('http');
const { articolRouter } = require('./routes/articolRoutes.js');
const { proiectRouter } = require('./routes/proiectRoutes.js');
const { userRouter } = require('./routes/userRoutes.js');
// const { seedRouter } = require('./routes/seedRoutes.js');
const { uploadRouter } = require('./routes/uploadRoutes.js');
const { mailRouter } = require('./routes/mailRoutes.js');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//send email at contact

// let transporter = nodemailer.createTransport({
//   host: process.env.HOST_EMAIL,
//   port: process.env.PORT_EMAIL,
//   secure: true,
//   auth: {
//     user: process.env.USER_EMAIL,
//     pass: process.env.PASS_EMAIL,
//   },
// });

// // verify connection configuration
// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Server is ready to take our messages');
//   }
// });

//   routes
// app.use('/api/seed', seedRouter);
app.use('/api/mail', mailRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/articole', articolRouter);
app.use('/api/proiecte', proiectRouter);
app.use('/api/users', userRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

let server = http.createServer(app);

server.listen(port, () => {
  console.log(`Merge backend-ul acuma pe port-ul ${port}`);
});
