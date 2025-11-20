import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('❌ MONGODB_URI no está definida en el archivo .env');
    }
    
    console.log('🔄 Intentando conectar a MongoDB...');
    
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB conectado correctamente');
    console.log('📦 Base de datos:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};

// Manejar eventos de la conexión
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error en la conexión de MongoDB:', err);
});

export default connectDB;