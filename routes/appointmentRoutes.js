const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment'); // Verifique se o caminho está correto

// Rota para criar um agendamento
router.post('/', async (req, res) => {  // O prefixo '/api/appointments' já é adicionado no server.js
    const { userName, userCPF, userPhone, userEmail, carId, appointmentDate } = req.body;

    const appointmentDay = new Date(appointmentDate);
    if (appointmentDay.getDay() !== 6) { // Verifica se a data é sábado
        return res.status(400).json({ message: "Agendamentos só são permitidos aos sábados." });
    }

    const startTime = new Date(appointmentDay.getTime() - 15 * 60000);
    const endTime = new Date(appointmentDay.getTime() + 15 * 60000);

    const existingAppointment = await Appointment.findOne({
        appointmentDate: {
            $gte: startTime,
            $lte: endTime,
        },
    });

    if (existingAppointment) {
        return res.status(400).json({ message: "Já existe um agendamento nesse horário." });
    }

    try {
        const newAppointment = new Appointment({
            userName,
            userCPF,
            userPhone,
            userEmail,
            carId,
            appointmentDate,
            status: 'Agendado',
        });

        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        res.status(500).json({ message: "Erro ao criar agendamento." });
    }
});

module.exports = router;
