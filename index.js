// index.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDb = require('./config/db'); // conexión a MongoDB
const Routes = require('./routes/routes'); // asegúrate que exista

const app = express();

// ====== CORS ======
const allowedOrigins = [
  'http://localhost:5173',
  'https://antostoremakeup.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origin (ej: Postman, servidores internos)
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

// ====== Middlewares ======
app.use(express.json());
app.use(morgan('dev'));

// ====== Rutas ======
app.use('/api', Routes);

app.get('/', (req, res) => {
  res.send('Hello from Vercel!');
});

// ====== Start server ======
const startServer = async () => {
  try {
    await connectDb();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

// ✅ Exportar app para que Vercel lo use
module.exports = app;
