const express = require('express');
const cors = require('cors'); // Importa o middleware CORS
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const carRoutes = require('./routes/carRoutes');
const appointmentsRouter = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes'); // Importa suas rotas de autenticação


dotenv.config();
connectDB();

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());
app.use('/api/cars', carRoutes);
app.use('/api', appointmentsRouter);
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
