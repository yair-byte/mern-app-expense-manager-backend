const mongoose = require('mongoose');

const outgoingSchema = new mongoose.Schema({
  cantidad: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  categoria: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Outgoing', outgoingSchema, 'outgoing');   //ultimo parametro es el nombre de la coleccion