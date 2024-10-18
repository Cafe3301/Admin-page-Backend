const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  username: { type: String, required: true },
  cpf: { type: Number, required: true },
  name: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  status: { type: String, enum: ['Aguardando', 'Lavando', 'Pronto'], default: 'Aguardando' },
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
