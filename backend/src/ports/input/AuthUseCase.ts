import { LoginDTO, AuthResponse, User } from '../../domain/entities/User';

export interface AuthUseCase {
  login(data: LoginDTO): Promise<AuthResponse>;
  register(data: Omit<User, 'id'>): Promise<User>;
  getProfile(userId: string): Promise<Omit<User, 'password'>>;
}
