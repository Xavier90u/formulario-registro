import { Company } from '../../domain/entities/Company';

export interface CompanyRepository {
  crear(company: Company): Promise<Company>;
  obtenerPorId(id: string): Promise<Company | null>;
  obtenerPorSlug(slug: string): Promise<Company | null>;
  obtenerPorEmail(email: string): Promise<Company | null>;
  listar(filtros?: { status?: string }): Promise<Company[]>;
  actualizar(id: string, data: Partial<Company>): Promise<Company>;
  eliminar(id: string): Promise<void>;
}
