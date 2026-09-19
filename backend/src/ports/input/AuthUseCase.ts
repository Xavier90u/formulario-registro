import { LoginDTO, AuthResponse, User, RegisterDTO } from '../../domain/entities/User';

export interface AuthUseCase {
  login(data: LoginDTO): Promise<AuthResponse>;
  register(data: RegisterDTO): Promise<Omit<User, 'password'>>;
  getProfile(userId: string): Promise<Omit<User, 'password'>>;
  updateProfile(userId: string, data: { nombre?: string; phone?: string; email?: string }): Promise<Omit<User, 'password'>>;
}
