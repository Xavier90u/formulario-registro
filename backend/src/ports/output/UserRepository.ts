import { User } from '../../domain/entities/User';

export interface UserRepository {
  crear(user: User): Promise<User>;
  obtenerPorEmail(email: string): Promise<User | null>;
  obtenerPorId(id: string): Promise<User | null>;
  listarPorCompany(companyId: string): Promise<User[]>;
  actualizar(id: string, data: Partial<User>): Promise<User>;
  eliminar(id: string): Promise<void>;
}
