const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');
const Routes = require('./routes/routes'); // Asegúrate de que esta ruta exista

const app = express();
const PORT = 3000;

// Conectar a la base de datos MongoDB
connectDB();

// Middleware básicos
app.use(bodyParser.json());
app.use(morgan('dev'));

// ✅ Middleware CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://antostoremakeup.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // permitir peticiones sin origin (ej: Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Rutas
app.use('/api', Routes);

app.get('/', (req, res) => {
  res.send('Hello from Vercel!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
