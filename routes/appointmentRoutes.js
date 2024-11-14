const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Rota para criar um agendamento
router.post('/', async (req, res) => {
    const { userName, userCPF, userPhone, userEmail, carId, appointmentDate } = req.body;

    const appointmentDay = new Date(appointmentDate);
    if (appointmentDay.getDay() !== 6) {
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

// Rota para buscar todos os agendamentos
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
});

// Rota para excluir um agendamento
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ message: "Agendamento não encontrado." });
        }

        res.status(200).json({ message: "Agendamento excluído com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
        res.status(500).json({ message: "Erro ao excluir o agendamento." });
    }
});

module.exports = router;
