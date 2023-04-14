const mongoose = require('mongoose');

const incomingSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Incoming', incomingSchema, 'incoming');   //ultimo parametro es el nombre de la coleccion