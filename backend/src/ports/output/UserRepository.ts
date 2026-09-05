import { User } from '../../domain/entities/User';

export interface UserRepository {
  crear(user: User): Promise<User>;
  obtenerPorEmail(email: string): Promise<User | null>;
  obtenerPorId(id: string): Promise<User | null>;
}
