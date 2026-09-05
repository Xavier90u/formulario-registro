import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config/env';
import { UserModel } from './adapters/output/database/UserModel';

const seedAdmin = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Conectado a MongoDB');

    const existingAdmin = await UserModel.findOne({ email: 'admin@admin.com' });
    if (existingAdmin) {
      console.log('El usuario admin ya existe');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new UserModel({
      email: 'admin@admin.com',
      password: hashedPassword,
      nombre: 'Administrador',
      role: 'admin',
    });

    await admin.save();
    console.log('Usuario admin creado exitosamente');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error al crear admin:', error);
    process.exit(1);
  }
};

seedAdmin();
