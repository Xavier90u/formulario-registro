import { User } from '../../../../domain/entities/User';
import { UserRepository } from '../../../../ports/output/UserRepository';
import { UserModel, UserDocument } from '../models/UserModel';

function toDomain(doc: any): User {
  return {
    id: doc._id.toString(),
    email: doc.email,
    password: doc.password,
    nombre: doc.nombre,
    phone: doc.phone,
    role: doc.role,
    companyId: doc.companyId?.toString(),
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoUserRepository implements UserRepository {
  async crear(user: User): Promise<User> {
    const model = new UserModel({
      email: user.email,
      password: user.password,
      nombre: user.nombre,
      phone: user.phone,
      role: user.role,
      companyId: user.companyId,
      isActive: user.isActive,
    });
    const saved = await model.save();
    return toDomain(saved);
  }

  async obtenerPorEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? toDomain(doc) : null;
  }

  async obtenerPorId(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async listarPorCompany(companyId: string): Promise<User[]> {
    const docs = await UserModel.find({ companyId }).sort({ nombre: 1 });
    return docs.map(toDomain);
  }

  async actualizar(id: string, data: Partial<User>): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) throw new Error('Usuario no encontrado');
    return toDomain(doc);
  }

  async eliminar(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
