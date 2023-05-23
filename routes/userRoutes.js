const bcrypt = require('bcryptjs');
const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { User } = require('../models/userModel.js');
const { generateToken, isAdmin, isAuth } = require('../utils.js');

const userRouter = express.Router();

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({
        message: 'Utilizatorul a fost modificat cu succes',
        user: updatedUser,
      });
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === req.params.email) {
        res
          .status(400)
          .send({ message: 'Nu se poate sterge utiliztorul admin' });
        return;
      }
      await user.remove();
      res.send({ message: 'Utilizator' });
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid user or password' });
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

module.exports = { userRouter };
