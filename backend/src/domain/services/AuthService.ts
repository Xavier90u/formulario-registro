import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, LoginDTO, AuthResponse } from '../entities/User';
import { AuthUseCase } from '../../ports/input/AuthUseCase';
import { UserRepository } from '../../ports/output/UserRepository';
import { CustomError } from '../../shared/errors/CustomError';

export class AuthService implements AuthUseCase {
  private readonly JWT_SECRET: string;

  constructor(private readonly userRepository: UserRepository) {
    this.JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.obtenerPorEmail(data.email);
    if (!user) {
      throw new CustomError('Credenciales inválidas', 401);
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new CustomError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async register(data: Omit<User, 'id'>): Promise<User> {
    const existingUser = await this.userRepository.obtenerPorEmail(data.email);
    if (existingUser) {
      throw new CustomError('El email ya está registrado', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.crear({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.obtenerPorId(userId);
    if (!user) {
      throw new CustomError('Usuario no encontrado', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
