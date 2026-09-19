import { Company, CreateCompanyDTO, UpdateCompanyDTO } from '../../domain/entities/Company';

export interface CompanyUseCase {
  crear(data: CreateCompanyDTO): Promise<Company>;
  obtenerPorId(id: string): Promise<Company>;
  obtenerPorSlug(slug: string): Promise<Company>;
  listar(): Promise<Company[]>;
  actualizar(id: string, data: UpdateCompanyDTO): Promise<Company>;
  cambiarEstado(id: string, status: Company['status']): Promise<Company>;
}
