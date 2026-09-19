import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, LoginDTO, AuthResponse, RegisterDTO } from '../../domain/entities/User';
import { AuthUseCase } from '../../ports/input/AuthUseCase';
import { UserRepository } from '../../ports/output/UserRepository';
import { CustomError } from '../../shared/errors/CustomError';
import { config } from '../../config/env';

export class AuthService implements AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.obtenerPorEmail(data.email);
    if (!user) {
      throw new CustomError('Credenciales inválidas', 401);
    }

    if (!user.isActive) {
      throw new CustomError('Cuenta desactivada', 401);
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new CustomError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async register(data: RegisterDTO): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.obtenerPorEmail(data.email);
    if (existingUser) {
      throw new CustomError('El email ya está registrado', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.crear({
      email: data.email,
      password: hashedPassword,
      nombre: data.nombre,
      phone: data.phone,
      role: 'customer',
      isActive: true,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.obtenerPorId(userId);
    if (!user) {
      throw new CustomError('Usuario no encontrado', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(
    userId: string,
    data: { nombre?: string; phone?: string; email?: string }
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.obtenerPorId(userId);
    if (!user) {
      throw new CustomError('Usuario no encontrado', 404);
    }

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.obtenerPorEmail(data.email);
      if (existing) {
        throw new CustomError('El email ya está en uso', 400);
      }
    }

    const updated = await this.userRepository.actualizar(userId, data);
    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }
}
