import { Event, CreateEventDTO, UpdateEventDTO, EventStatus } from '../../domain/entities/Event';
import { EventUseCase } from '../../ports/input/EventUseCase';
import { EventRepository } from '../../ports/output/EventRepository';
import { TicketTypeRepository } from '../../ports/output/TicketTypeRepository';
import { TicketRepository } from '../../ports/output/TicketRepository';
import { OrderRepository } from '../../ports/output/OrderRepository';
import { CustomError } from '../../shared/errors/CustomError';

function generateEventSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export class EventService implements EventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly ticketTypeRepository: TicketTypeRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  async crear(companyId: string, data: CreateEventDTO): Promise<Event> {
    let slug = generateEventSlug(data.name);
    const existingSlug = await this.eventRepository.obtenerPorSlug(companyId, slug);
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const event = await this.eventRepository.crear({
      companyId,
      slug,
      status: 'draft',
      maxTicketsPerUser: data.maxTicketsPerUser || 4,
      isPublished: false,
      ...data,
    });

    return event;
  }

  async obtenerPorId(id: string): Promise<Event> {
    const event = await this.eventRepository.obtenerPorId(id);
    if (!event) {
      throw new CustomError('Evento no encontrado', 404);
    }
    return event;
  }

  async obtenerPorSlug(companyId: string, slug: string): Promise<Event> {
    const event = await this.eventRepository.obtenerPorSlug(companyId, slug);
    if (!event) {
      throw new CustomError('Evento no encontrado', 404);
    }
    return event;
  }

  async listarPorCompany(companyId: string, filtros?: { status?: EventStatus }): Promise<Event[]> {
    return this.eventRepository.listarPorCompany(companyId, filtros);
  }

  async listarPublicados(filtros?: { search?: string; date?: string }): Promise<Event[]> {
    return this.eventRepository.listarPublicados(filtros);
  }

  async actualizar(id: string, companyId: string, data: UpdateEventDTO): Promise<Event> {
    const event = await this.eventRepository.obtenerPorId(id);
    if (!event) {
      throw new CustomError('Evento no encontrado', 404);
    }

    if (event.companyId !== companyId) {
      throw new CustomError('No tiene permisos para editar este evento', 403);
    }

    if (data.name && data.name !== event.name) {
      let newSlug = generateEventSlug(data.name);
      const existingSlug = await this.eventRepository.obtenerPorSlug(companyId, newSlug);
      if (existingSlug && existingSlug.id !== id) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      (data as any).slug = newSlug;
    }

    return this.eventRepository.actualizar(id, data);
  }

  async cambiarEstado(id: string, companyId: string, status: EventStatus): Promise<Event> {
    const event = await this.eventRepository.obtenerPorId(id);
    if (!event) {
      throw new CustomError('Evento no encontrado', 404);
    }

    if (event.companyId !== companyId) {
      throw new CustomError('No tiene permisos para modificar este evento', 403);
    }

    const updateData: Partial<Event> = { status };

    if (status === 'published' && !event.isPublished) {
      updateData.isPublished = true;
      updateData.publishedAt = new Date();
    }

    return this.eventRepository.actualizar(id, updateData);
  }

  async obtenerDashboard(companyId: string): Promise<{
    totalEvents: number;
    activeEvents: number;
    upcomingEvents: number;
    finishedEvents: number;
    totalTicketsSold: number;
    totalRevenue: number;
  }> {
    const statusCounts = await this.eventRepository.contarPorCompany(companyId);
    const events = await this.eventRepository.listarPorCompany(companyId);

    const now = new Date();
    const upcomingEvents = events.filter(
      (e) => new Date(e.date) > now && ['published', 'active'].includes(e.status)
    ).length;

    let totalTicketsSold = 0;
    let totalRevenue = 0;

    for (const event of events) {
      if (event.id) {
        const ticketCount = await this.ticketRepository.contarPorEvent(event.id);
        totalTicketsSold += ticketCount.active + ticketCount.used;

        const orderStats = await this.orderRepository.contarPorEvent(event.id);
        totalRevenue += orderStats.totalRevenue;
      }
    }

    return {
      totalEvents: statusCounts.total,
      activeEvents: statusCounts.active,
      upcomingEvents,
      finishedEvents: statusCounts.finished,
      totalTicketsSold,
      totalRevenue,
    };
  }
}
