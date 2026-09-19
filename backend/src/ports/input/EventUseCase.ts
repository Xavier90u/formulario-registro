import { Event, CreateEventDTO, UpdateEventDTO, EventStatus } from '../../domain/entities/Event';

export interface EventUseCase {
  crear(companyId: string, data: CreateEventDTO): Promise<Event>;
  obtenerPorId(id: string): Promise<Event>;
  obtenerPorSlug(companyId: string, slug: string): Promise<Event>;
  listarPorCompany(companyId: string, filtros?: { status?: EventStatus }): Promise<Event[]>;
  listarPublicados(filtros?: { search?: string; date?: string }): Promise<Event[]>;
  actualizar(id: string, companyId: string, data: UpdateEventDTO): Promise<Event>;
  cambiarEstado(id: string, companyId: string, status: EventStatus): Promise<Event>;
  obtenerDashboard(companyId: string): Promise<{
    totalEvents: number;
    activeEvents: number;
    upcomingEvents: number;
    finishedEvents: number;
    totalTicketsSold: number;
    totalRevenue: number;
  }>;
}
