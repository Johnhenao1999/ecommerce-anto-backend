// index.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Routes = require('./routes/routes');

// ====== CORS ======
const app = express();

// Configurar CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'https://lsneakers.vercel.app'], // Acepta ambos orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
// ====== Middlewares ======
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'https://antostoremakeup.vercel.app'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Manejo de preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use('/api', Routes);

app.get('/', (req, res) => {
  res.send('Hello from Vercel!');
});

// Conexión a la base de datos
const connectDb = async () => {
  try {
    await mongoose.connect('mongodb+srv://antostorebeautymakeup:Q53RTUNqGfrIJoJq@antostore.a4bm6c0.mongodb.net/antostore?retryWrites=true&w=majority&appName=AntoStore');
    console.log('Conectado correctamente a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Termina el proceso si no puede conectar a la base de datos
  }
};

const startServer = async () => {
  await connectDb();
  app.listen(3000, () => {
      console.log("Server on port 3000");
  });
};

startServer();
// ====== Exportar app para Vercel ======
module.exports = app;