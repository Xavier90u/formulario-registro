import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config/env';
import { CompanyModel } from './adapters/output/database/models/CompanyModel';
import { UserModel } from './adapters/output/database/models/UserModel';

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Conectado a MongoDB');

    const existingSuperAdmin = await UserModel.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('El usuario superadmin ya existe');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const superAdmin = new UserModel({
      email: 'admin@admin.com',
      password: hashedPassword,
      nombre: 'Administrador',
      role: 'superadmin',
      isActive: true,
    });

    await superAdmin.save();
    console.log('Usuario superadmin creado exitosamente');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');

    const demoCompany = new CompanyModel({
      name: 'Empresa Demo',
      email: 'demo@empresa.com',
      phone: '+51 999 888 777',
      description: 'Empresa de demostración para pruebas',
      slug: 'empresa-demo',
      status: 'active',
    });

    const savedCompany = await demoCompany.save();
    console.log('Empresa demo creada:', savedCompany.name);

    const companyAdmin = new UserModel({
      email: 'empresa@admin.com',
      password: hashedPassword,
      nombre: 'Admin Empresa Demo',
      role: 'company_admin',
      companyId: savedCompany._id,
      isActive: true,
    });

    await companyAdmin.save();
    console.log('Admin de empresa creado: empresa@admin.com');

    process.exit(0);
  } catch (error) {
    console.error('Error al crear seed:', error);
    process.exit(1);
  }
};

seed();
