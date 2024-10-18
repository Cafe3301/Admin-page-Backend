const express = require('express');
const router = express.Router();
const Car = require('../models/Car'); // Supondo que você tenha um modelo Car

// Rota para adicionar um carro
router.post('/', async (req, res) => {
  const { name, model, year, status, username, cpf } = req.body;

  try {
    const newCar = new Car({
      name,
      model,
      year,
      status,
      username, // Adicionando username
      cpf, // Adicionando cpf
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add car', error });
  }
});

module.exports = router;