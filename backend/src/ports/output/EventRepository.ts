import { Event, EventStatus } from '../../domain/entities/Event';

export interface EventRepository {
  crear(event: Event): Promise<Event>;
  obtenerPorId(id: string): Promise<Event | null>;
  obtenerPorSlug(companyId: string, slug: string): Promise<Event | null>;
  listarPorCompany(companyId: string, filtros?: { status?: EventStatus }): Promise<Event[]>;
  listarPublicados(filtros?: { search?: string; date?: string }): Promise<Event[]>;
  actualizar(id: string, data: Partial<Event>): Promise<Event>;
  eliminar(id: string): Promise<void>;
  contarPorCompany(companyId: string): Promise<{
    total: number;
    active: number;
    draft: number;
    published: number;
    finished: number;
    sold_out: number;
    cancelled: number;
  }>;
}
