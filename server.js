const express = require('express');
const cors = require('cors'); // Importa o middleware CORS
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const carRoutes = require('./routes/carRoutes');
const appointmentsRouter = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes'); // Importa suas rotas de autenticação
const path = require('path');


dotenv.config();
connectDB();

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem-vindo à nossa API!' });
});

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());
app.use('/api/cars', carRoutes);
app.use('/api', appointmentsRouter);
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
