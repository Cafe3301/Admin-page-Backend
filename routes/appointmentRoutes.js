const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment'); // Verifique se o caminho está correto

// Rota para criar um agendamento
router.post('/appointments', async (req, res) => {
    const { userName, userCPF, userPhone, userEmail, carId, appointmentDate } = req.body; // Adicione userPhone e userEmail

    // Verifica se a data é um sábado
    const appointmentDay = new Date(appointmentDate);
    if (appointmentDay.getDay() !== 6) { // 6 representa sábado
        return res.status(400).json({ message: "Agendamentos só são permitidos aos sábados." });
    }

    // Verifica se já existe um agendamento no mesmo horário ou em um intervalo de 15 minutos
    const startTime = new Date(appointmentDay.getTime() - 15 * 60000); // 15 minutos antes
    const endTime = new Date(appointmentDay.getTime() + 15 * 60000); // 15 minutos depois

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
            userPhone, // Agora está definido corretamente
            userEmail, // Agora está definido corretamente
            carId,
            appointmentDate,
            status: 'Agendado', // Você pode definir um status padrão aqui
        });

        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        res.status(500).json({ message: "Erro ao criar agendamento." });
    }
});

// Rota para buscar agendamentos
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('carId'); // Preenche informações do carro
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
});

// Rota para buscar agendamentos de um usuário específico
router.get('/appointments/user/:cpf', async (req, res) => {
    const { cpf } = req.params; // Pega o CPF da URL
    try {
        const appointments = await Appointment.find({ userCPF: cpf }).populate('carId'); // Busca agendamentos pelo CPF
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
});

// Rota para deletar um agendamento
router.delete('/appointments/:id', async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const appointment = await Appointment.findByIdAndDelete(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Agendamento não encontrado." });
        }
        res.status(204).send(); // Sem conteúdo após deletar
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar agendamento." });
    }
});

module.exports = router;
