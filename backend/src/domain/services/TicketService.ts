import { Ticket } from '../../domain/entities/Ticket';
import { TicketUseCase } from '../../ports/input/TicketUseCase';
import { TicketRepository } from '../../ports/output/TicketRepository';
import { EventRepository } from '../../ports/output/EventRepository';
import { TicketTypeRepository } from '../../ports/output/TicketTypeRepository';
import { CompanyRepository } from '../../ports/output/CompanyRepository';
import { TicketPdfData } from '../../ports/output/PdfPort';
import { CustomError } from '../../shared/errors/CustomError';

export class TicketService implements TicketUseCase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly eventRepository: EventRepository,
    private readonly ticketTypeRepository: TicketTypeRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  async listarPorUser(userId: string): Promise<Ticket[]> {
    return this.ticketRepository.listarPorUser(userId);
  }

  async obtenerPorCode(code: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.obtenerPorCode(code);
    if (!ticket) {
      throw new CustomError('Entrada no encontrada', 404);
    }
    return ticket;
  }

  async obtenerPdfData(code: string): Promise<TicketPdfData> {
    const ticket = await this.ticketRepository.obtenerPorCode(code);
    if (!ticket) {
      throw new CustomError('Entrada no encontrada', 404);
    }

    const event = await this.eventRepository.obtenerPorId(ticket.eventId);
    if (!event) {
      throw new CustomError('Evento no encontrado', 404);
    }

    const ticketType = await this.ticketTypeRepository.obtenerPorId(ticket.ticketTypeId);
    const company = await this.companyRepository.obtenerPorId(ticket.companyId);

    return {
      ticket,
      eventName: event.name,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventAddress: event.address,
      ticketTypeName: ticketType?.name || 'General',
      companyName: company?.name || 'Empresa',
    };
  }

  async checkIn(code: string, staffId: string, companyId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.obtenerPorCode(code);
    if (!ticket) {
      throw new CustomError('Entrada no encontrada', 404);
    }

    if (ticket.companyId !== companyId) {
      throw new CustomError('Esta entrada no pertenece a su empresa', 403);
    }

    if (ticket.status === 'used') {
      throw new CustomError('Esta entrada ya fue utilizada', 400);
    }

    if (ticket.status === 'cancelled') {
      throw new CustomError('Esta entrada ha sido cancelada', 400);
    }

    return this.ticketRepository.checkIn(code, staffId);
  }
}
