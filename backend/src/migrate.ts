import mongoose from 'mongoose';
import { config } from './config/env';

const migrate = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Conectado a MongoDB');

    const db = mongoose.connection.db;

    // Migrate user roles: admin -> superadmin, user -> customer
    const usersResult = await db.collection('users').updateMany(
      { role: 'admin' },
      { $set: { role: 'superadmin', isActive: true } }
    );
    console.log(`Usuarios migrados a superadmin: ${usersResult.modifiedCount}`);

    const usersResult2 = await db.collection('users').updateMany(
      { role: 'user' },
      { $set: { role: 'customer', isActive: true } }
    );
    console.log(`Usuarios migrados a customer: ${usersResult2.modifiedCount}`);

    // Add isActive to users that don't have it
    await db.collection('users').updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );
    console.log('isActive agregado a usuarios que no lo tenían');

    // Drop old ticket collection
    const collections = await db.listCollections().toArray();
    const hasOldTickets = collections.find((c) => c.name === 'tickets');
    if (hasOldTickets) {
      await db.dropCollection('tickets');
      console.log('Colección antigua "tickets" eliminada');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error en migración:', error);
    process.exit(1);
  }
};

migrate();
