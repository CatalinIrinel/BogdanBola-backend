const express = require('express');
const { Articol } = require('../models/articolModel.js');
const { data } = require('../data.js');
const { User } = require('../models/userModel.js');

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  // await Articol.deleteMany();
  // const createdArticole = await Articol.insertMany(data.articole);
  await User.deleteMany();
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
});

module.exports = { seedRouter };
