const express = require('express');
const routerOutgoing = express.Router();
const Outgoing = require('../models/outgoing.js');

// Middlewares
routerOutgoing.use(express.json());

async function getGasto(req, res, next) {  // Obtener un gasto por ID
  let gasto;
  try {
    gasto = await Outgoing.findById(req.params.id);
    if (gasto == null) {
      return res.status(404).json({ message: 'No se encontró el gasto' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.gasto = gasto;
  next();
}

// GET - Obtener todos los gastos
routerOutgoing.get('/', async (req, res) => {
  try {
    const gastos = await Outgoing.find();
    res.status(200).json(gastos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - obtener gastos de una categoria por orden asc o desc (fecha o cantidad)
//ej /categoria?orden=fasc 
routerOutgoing.get('/:categoria', async (req, res) => {
  try {
    const categoria = req.params.categoria;
    const orden = req.query.orden || 'fdesc'; 
    const gastos = await Outgoing.find();
    const resultados = gastos.filter(gasto => gasto.categoria === categoria);
    
    if (orden === 'fdesc') {
      resultados.sort((a, b) => b.fecha - a.fecha);
    } else if (orden === 'fasc') {
      resultados.sort((a, b) => a.fecha - b.fecha);
    } else if (orden === 'cdesc') {
      resultados.sort((a, b) => b.cantidad - a.cantidad);
    } else {
      resultados.sort((a, b) => a.cantidad - b.cantidad);
    }

    res.status(200).json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET - Obtener un gasto por ID
routerOutgoing.get('/:id', getGasto, (req, res) => {
  res.json(res.gasto);
});
*/

// POST - Crear un gasto
routerOutgoing.post('/', async (req, res) => {
  const gasto = new Outgoing({
    cantidad: req.body.cantidad,
    categoria: req.body.categoria,
    fecha: new Date(req.body.fecha)
  });
  try {
    const nuevoGasto = await gasto.save();
    res.status(201).json(nuevoGasto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Actualizar un gasto
routerOutgoing.put('/:id', getGasto, async (req, res) => {
  res.gasto.cantidad = 0;
  res.gasto.fecha = new Date();
  res.gasto.categoria = 'otros';

  if (req.body.cantidad != null) {
    res.gasto.cantidad = req.body.cantidad;
  }
  if (req.body.categoria != null) {
    res.gasto.categoria = req.body.categoria;
  }
  if (req.body.fecha != null) {
    res.gasto.fecha = req.body.fecha;
  }
  try {
    const gastoActualizado = await res.gasto.save();
    res.status(200).json(gastoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Eliminar un gasto
routerOutgoing.delete('/:id', async (req, res) => {
  try {
    let gastoId = req.params.id;
    const gasto = await Outgoing.findById(gastoId);
    if (!gasto) {
      return res.status(404).json({ message: 'No se encontró el gasto' });
    }
    await Outgoing.findByIdAndDelete(gastoId);
    res.status(200).json(gasto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = routerOutgoing;
