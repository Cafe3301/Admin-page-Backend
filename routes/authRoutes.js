// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Supondo que você tenha um modelo User
const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('Usuário criado');
});

// Rota para login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        
        if (match) {
            // Aqui você pode gerar um token JWT, se estiver usando
            res.send('Login bem-sucedido');
        } else {
            res.status(401).send('Senha incorreta');
        }
    } else {
        res.status(404).send('Usuário não encontrado');
    }
});

module.exports = router;
