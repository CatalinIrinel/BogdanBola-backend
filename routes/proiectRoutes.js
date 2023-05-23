const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { Proiect } = require('../models/proiectModel.js');
const { isAdmin, isAuth } = require('../utils.js');

const proiectRouter = express.Router();

proiectRouter.get('/', async (req, res) => {
  const { query } = req;
  const page = query.page || 1;
  const pageSize = 9;
  const proiecte = await Proiect.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  const countProiecte = await Proiect.countDocuments();
  res.send({
    proiecte,
    countProiecte,
    page,
    pages: Math.ceil(countProiecte / pageSize),
  });
});

proiectRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProiect = new Proiect({
      title: req.body.title,
      image: req.body.image,
      text: req.body.text,
      link: req.body.link,
    });
    const proiect = await newProiect.save();
    res.send({ message: 'Proiectul a fost creat' }, proiect);
  })
);

proiectRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const articolId = req.params.id;
    const articol = await Proiect.findById(articolId);
    if (articol) {
      articol.title = req.body.title;
      articol.image = req.body.image;
      articol.text = req.body.text;
      articol.link = req.body.link;
      await articol.save();
      res.send({ message: 'Proiect modificat cu succes' });
    } else {
      res.status(404).send({ message: 'Proiectul nu a fost gasit' });
    }
  })
);

proiectRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const proiect = await Proiect.findById(req.params.id);
    if (proiect) {
      await proiect.remove();
      res.send({ message: 'Proiectul a fost sters cu succes' });
    } else {
      res.status(404).send({ message: 'Proiectul nu a fost gasit' });
    }
  })
);

const PAGE_SIZE = 10;

proiectRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const proiect = await Proiect.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProiecte = await Proiect.countDocuments();

    res.send({
      proiect,
      countProiecte,
      page,
      pages: Math.ceil(countProiecte / pageSize),
    });
  })
);

module.exports = { proiectRouter };
