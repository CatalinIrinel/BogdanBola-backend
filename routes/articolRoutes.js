const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { Articol } = require('../models/articolModel.js');
const { isAdmin, isAuth } = require('../utils.js');

const articolRouter = express.Router();

articolRouter.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = 6;
  const articole = await Articol.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ dataPostare: -1 });
  const countArticole = await Articol.countDocuments();
  res.send({
    articole,
    countArticole,
    page,
    pages: Math.ceil(countArticole / pageSize),
  });
});

articolRouter.get('/home', async (req, res) => {
  const articole = await Articol.find().limit(6).sort({ dataPostare: -1 });
  res.send(articole);
});

articolRouter.post(
  '/new',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newArticol = new Articol({
      slugId: '1' + Date.now(),
      title: 'sample article ' + Date.now(),
      cover: '/images/a1.jpg.webp',
      text: 'sample text',
      slug: 'sample slug ' + Date.now(),
      categorie: ['sample', 'category'],
      dataPostare: Date.now(),
      etichete: ['sample', 'etichete'],
      link: '/sample-link/' + Date.now(),
    });
    const articol = await newArticol.save();
    res.send({ message: 'Articol creat', articol });
  })
);

articolRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const articolId = req.params.id;
    const articol = await Articol.findById(articolId);
    if (articol) {
      articol.slugId = req.body.slugId;
      articol.title = req.body.title;
      articol.slug = req.body.slug;
      articol.images = req.body.images;
      articol.cover = req.body.cover;
      articol.text = req.body.text;
      articol.categorie = req.body.categorie;
      articol.dataPostare = req.body.dataPostare;
      articol.etichete = req.body.etichete;
      articol.link = req.body.link;
      await articol.save();
      res.send({ message: 'Articol modificat cu succes' });
    } else {
      res.status(404).send({ message: 'Articolul nu a fost gasit' });
    }
  })
);

articolRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const articol = await Articol.findById(req.params.id);
    if (articol) {
      await articol.remove();
      res.send({ message: 'Articolul a fost sters cu succes' });
    } else {
      res.status(404).send({ message: 'Articolul nu a fost gasit' });
    }
  })
);

const PAGE_SIZE = 10;

articolRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const articole = await Articol.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({ dataPostare: -1 });
    const countArticole = await Articol.countDocuments();

    res.send({
      articole,
      countArticole,
      page,
      pages: Math.ceil(countArticole / pageSize),
    });
  })
);

articolRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || 9;
    const page = query.page || 1;
    const category = query.category || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const sortOrder =
      order === 'oldest'
        ? { createdAt: 1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const articole = await Articol.find({
      ...queryFilter,
      ...categoryFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countArticole = await Articol.countDocuments({
      ...queryFilter,
      ...categoryFilter,
    });

    res.send({
      articole,
      countArticole,
      page,
      pages: Math.ceil(countArticole / pageSize),
    });
  })
);

articolRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Articol.find().distinct('categorie');
    res.send(categories);
  })
);

articolRouter.get('/slug/:slug', async (req, res) => {
  const articol = await Articol.findOne({ slug: req.params.slug });
  if (articol) {
    res.send(articol);
  } else {
    res.status(404).send({ message: 'Articolul nu a fost gasit' });
  }
});

articolRouter.get('/:id', async (req, res) => {
  const articol = await Articol.findById(req.params.id);
  if (articol) {
    res.send(articol);
  } else {
    res.status(404).send({ message: 'Articolul nu a fost gasit' });
  }
});

module.exports = { articolRouter };
