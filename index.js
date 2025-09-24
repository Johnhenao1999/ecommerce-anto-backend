// index.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Routes = require('./routes/routes');

const app = express();

// ====== CORS ======
const allowedOrigins = [
  'http://localhost:5173',
  'https://antostoremakeup.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman o internos
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

// ====== Middlewares ======
app.use(express.json());
app.use(morgan('dev'));

// ====== Rutas ======
app.use('/api', Routes);

app.get('/', (req, res) => {
  res.send('Hello from Vercel!');
});

// ====== Conexión a Mongo ======
mongoose
  .connect(
    'mongodb+srv://antostorebeautymakeup:Q53RTUNqGfrIJoJq@antostore.a4bm6c0.mongodb.net/antostore?retryWrites=true&w=majority&appName=AntoStore'
  )
  .then(() => console.log('✅ Conectado correctamente a la base de datos'))
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err);
  });

// ====== Exportar app para Vercel ======
module.exports = app;

// ====== Levantar servidor solo en local ======
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  });
}
