const mongoose = require('mongoose');

const articolSchema = new mongoose.Schema(
  {
    slugId: { type: String, unique: true },
    title: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    images: [String],
    cover: { type: String },
    text: { type: String, required: true },
    categorie: [String],
    dataPostare: { type: String, required: true },
    etichete: [String],
  },
  {
    timestamps: true,
  }
);

const Articol = mongoose.model('Articol', articolSchema);
module.exports = { Articol };
