const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userCPF: { type: String, required: true },
    userPhone: { type: String, required: true }, 
    userEmail: { type: String, required: true }, 
    carId: { type: String, required: true }, // Alterado para String
    appointmentDate: { type: Date, required: true },
    status: { type: String, default: 'Agendado' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
