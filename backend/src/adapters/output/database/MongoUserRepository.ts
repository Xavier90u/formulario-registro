import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../ports/output/UserRepository';
import { UserModel, UserDocument } from './UserModel';

export class MongoUserRepository implements UserRepository {
  private toDomain(doc: UserDocument): User {
    return {
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      nombre: doc.nombre,
      role: doc.role,
    };
  }

  async crear(user: User): Promise<User> {
    const model = new UserModel({
      email: user.email,
      password: user.password,
      nombre: user.nombre,
      role: user.role,
    });
    const saved = await model.save();
    return this.toDomain(saved);
  }

  async obtenerPorEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? this.toDomain(doc) : null;
  }

  async obtenerPorId(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }
}
