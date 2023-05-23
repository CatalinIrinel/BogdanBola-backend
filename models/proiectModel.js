const mongoose = require('mongoose');

const proiectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    text: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Proiect = mongoose.model('Proiect', proiectSchema);
module.exports = { Proiect };
