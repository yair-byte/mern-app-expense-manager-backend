const express = require('express');
const routerIncoming = express.Router();
const Incoming = require('../models/incoming.js');

// Middlewares
routerIncoming.use(express.json());

async function getEntrante(req, res, next) {  // Obtener una entrada por ID
  let entrada;
  try {
    entrada = await Incoming.findById(req.params.id);
    if (entrada == null) {
      return res.status(404).json({ message: 'No se encontró la entrada' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.entrada = entrada;
  next();
}

// GET - Obtener todos las entradas
routerIncoming.get('/', async (req, res) => {
  try {
    const orden = req.query.orden || 'fdesc'; 
    const entradas = await Incoming.find();
    if (orden === 'fdesc') {
      entradas.sort((a, b) => b.fecha - a.fecha);
    } else if (orden === 'fasc') {
      entradas.sort((a, b) => a.fecha - b.fecha);
    } else if (orden === 'cdesc') {
      entradas.sort((a, b) => b.monto - a.monto);
    } else {
      entradas.sort((a, b) => a.monto - b.monto);
    }
    res.status(200).json(entradas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener una entrada por ID
routerIncoming.get('/:id', getEntrante, (req, res) => {
  res.json(res.entrada);
});

// POST - Crear un entrada
routerIncoming.post('/', async (req, res) => {
  const entrada = new Incoming({
    monto: req.body.monto,
    fecha: new Date(req.body.fecha)
  });
  try {
    const nuevoentrada = await entrada.save();
    res.status(201).json(nuevoentrada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Actualizar un entrada
routerIncoming.put('/:id', getEntrante, async (req, res) => {
  res.entrada.monto = 0;
  res.entrada.fecha = new Date();

  if (req.body.monto != null) {
    res.entrada.monto = req.body.monto;
  }
  if (req.body.fecha != null) {
    res.entrada.fecha = req.body.fecha;
  }
  try {
    const entradaActualizado = await res.entrada.save();
    res.status(200).json(entradaActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Eliminar un entrada
routerIncoming.delete('/:id', async (req, res) => {
  try {
    let entradaId = req.params.id;
    const entrada = await Incoming.findById(entradaId);
    if (!entrada) {
      return res.status(404).json({ message: 'No se encontró la entrada' });
    }
    await Incoming.findByIdAndDelete(entradaId);
    res.status(200).json(entrada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = routerIncoming;