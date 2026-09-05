import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/formulario-registro',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  nodeEnv: process.env.NODE_ENV || 'development',
};
