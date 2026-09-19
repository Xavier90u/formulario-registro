import { Company, CreateCompanyDTO, UpdateCompanyDTO } from '../../domain/entities/Company';
import { CompanyUseCase } from '../../ports/input/CompanyUseCase';
import { CompanyRepository } from '../../ports/output/CompanyRepository';
import { UserRepository } from '../../ports/output/UserRepository';
import { CustomError } from '../../shared/errors/CustomError';
import bcrypt from 'bcryptjs';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export class CompanyService implements CompanyUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository
  ) {}

  async crear(data: CreateCompanyDTO): Promise<Company> {
    const existingEmail = await this.companyRepository.obtenerPorEmail(data.email);
    if (existingEmail) {
      throw new CustomError('El email de la empresa ya está registrado', 400);
    }

    const existingAdminEmail = await this.userRepository.obtenerPorEmail(data.adminEmail);
    if (existingAdminEmail) {
      throw new CustomError('El email del administrador ya está registrado', 400);
    }

    let slug = generateSlug(data.name);
    const existingSlug = await this.companyRepository.obtenerPorSlug(slug);
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const company = await this.companyRepository.crear({
      name: data.name,
      email: data.email,
      phone: data.phone,
      description: data.description,
      logo: data.logo,
      slug,
      status: 'active',
    });

    const hashedPassword = await bcrypt.hash(data.adminPassword, 10);
    await this.userRepository.crear({
      email: data.adminEmail,
      password: hashedPassword,
      nombre: data.adminName,
      role: 'company_admin',
      companyId: company.id!,
      isActive: true,
    });

    return company;
  }

  async obtenerPorId(id: string): Promise<Company> {
    const company = await this.companyRepository.obtenerPorId(id);
    if (!company) {
      throw new CustomError('Empresa no encontrada', 404);
    }
    return company;
  }

  async obtenerPorSlug(slug: string): Promise<Company> {
    const company = await this.companyRepository.obtenerPorSlug(slug);
    if (!company) {
      throw new CustomError('Empresa no encontrada', 404);
    }
    return company;
  }

  async listar(): Promise<Company[]> {
    return this.companyRepository.listar();
  }

  async actualizar(id: string, data: UpdateCompanyDTO): Promise<Company> {
    const company = await this.companyRepository.obtenerPorId(id);
    if (!company) {
      throw new CustomError('Empresa no encontrada', 404);
    }

    if (data.email && data.email !== company.email) {
      const existing = await this.companyRepository.obtenerPorEmail(data.email);
      if (existing) {
        throw new CustomError('El email ya está en uso por otra empresa', 400);
      }
    }

    if (data.name && data.name !== company.name) {
      let newSlug = generateSlug(data.name);
      const existingSlug = await this.companyRepository.obtenerPorSlug(newSlug);
      if (existingSlug && existingSlug.id !== id) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      (data as any).slug = newSlug;
    }

    return this.companyRepository.actualizar(id, data);
  }

  async cambiarEstado(id: string, status: Company['status']): Promise<Company> {
    const company = await this.companyRepository.obtenerPorId(id);
    if (!company) {
      throw new CustomError('Empresa no encontrada', 404);
    }

    return this.companyRepository.actualizar(id, { status });
  }
}
