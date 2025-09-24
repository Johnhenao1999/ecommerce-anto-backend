const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
//const productRoutes = require('./routes/auth.routes');
const morgan = require('morgan');
const Routes = require('./routes/routes'); // Asegúrate de que la ruta sea correcta

const app = express();
const PORT = 3000;

// Conectar a la base de datos MongoDB
connectDB();

// Middleware para parsear el cuerpo de la solicitud
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173' , 'https://antostoremakeup.vercel.app'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Manejo de preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});
// Rutas
app.use('/api', Routes); // Ruta para productos

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});