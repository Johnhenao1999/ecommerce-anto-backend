const mongoose = require('mongoose');

const connectDb = async () => {
  try {
      await mongoose.connect('mongodb+srv://antostorebeautymakeup:Q53RTUNqGfrIJoJq@antostore.a4bm6c0.mongodb.net/?retryWrites=true&w=majority&appName=AntoStore');
      console.log('Conectado correctamente a la base de datos');
  } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      process.exit(1);
  }
};

module.exports = connectDb;
