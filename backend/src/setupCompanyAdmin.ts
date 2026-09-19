import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config/env';

const setupCompanyAdmin = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Conectado a MongoDB');

    const db = mongoose.connection.db;

    // Find Empresa Demo
    const company = await db.collection('companies').findOne({ slug: 'empresa-demo' });
    if (!company) {
      console.log('Empresa Demo no encontrada');
      process.exit(1);
    }
    console.log('Empresa encontrada:', company.name, company._id.toString());

    // Check if company admin already exists
    const existing = await db.collection('users').findOne({ email: 'empresa@admin.com' });
    if (existing) {
      console.log('El usuario empresa@admin.com ya existe');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const result = await db.collection('users').insertOne({
      email: 'empresa@admin.com',
      password: hashedPassword,
      nombre: 'Admin Empresa Demo',
      phone: '+51 999 888 777',
      role: 'company_admin',
      companyId: company._id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Usuario company_admin creado:', result.insertedId.toString());
    console.log('Email: empresa@admin.com');
    console.log('Password: admin123');
    console.log('Company:', company.name);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setupCompanyAdmin();
