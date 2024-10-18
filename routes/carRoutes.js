const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Rota para contar carros com status "Aguardando" e "Lavando"
router.get('/queue/count', async (req, res) => {
  try {
    const awaitingCount = await Car.countDocuments({ status: 'Aguardando' });
    const washingCount = await Car.countDocuments({ status: 'Lavando' });

    res.status(200).json({
      awaiting: awaitingCount,
      washing: washingCount,
    });
  } catch (error) {
    console.error("Erro ao contar carros na fila:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Rota para contar total de carros
router.get('/api/cars/count', async (req, res) => {
    try {
        const count = await Car.countDocuments(); // Conta todos os documentos no modelo Car
        res.status(200).json({ totalCars: count });
    } catch (error) {
        console.error("Erro ao contar carros:", error);
        res.status(500).json({ msg: "Erro no servidor" });
    }
});

// Rota para buscar carros pelo CPF do usuário
router.get('/user/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
      const cars = await Car.find({ cpf }); // Filtrando carros pelo CPF
      res.status(200).json(cars);
  } catch (error) {
      res.status(500).json({ msg: 'Erro ao buscar os carros', error });
  }
});


// Rota para obter todos os carros
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cars", error });
  }
});

// Rota para criar um carro
router.post('/', async (req, res) => {
  const newCar = new Car(req.body);
  try {
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ message: "Failed to create car", error });
  }
});

// Rota para atualizar o status do carro
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const car = await Car.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Failed to update car status", error });
  }
});

// Rota para excluir um carro
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete car", error });
  }
});

module.exports = router;
