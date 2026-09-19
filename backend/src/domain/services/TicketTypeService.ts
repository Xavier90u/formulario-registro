import { TicketType, CreateTicketTypeDTO, UpdateTicketTypeDTO } from '../../domain/entities/TicketType';
import { TicketTypeUseCase } from '../../ports/input/TicketTypeUseCase';
import { TicketTypeRepository } from '../../ports/output/TicketTypeRepository';
import { EventRepository } from '../../ports/output/EventRepository';
import { CustomError } from '../../shared/errors/CustomError';

export class TicketTypeService implements TicketTypeUseCase {
  constructor(
    private readonly ticketTypeRepository: TicketTypeRepository,
    private readonly eventRepository: EventRepository
  ) {}

  async crear(eventId: string, companyId: string, data: CreateTicketTypeDTO): Promise<TicketType> {
    const event = await this.eventRepository.obtenerPorId(eventId);
    if (!event) {
      throw new CustomError('Evento no encontrado', 404);
    }

    if (event.companyId !== companyId) {
      throw new CustomError('No tiene permisos para agregar entradas a este evento', 403);
    }

    const ticketType = await this.ticketTypeRepository.crear({
      eventId,
      name: data.name,
      description: data.description,
      price: data.price,
      totalQuantity: data.totalQuantity,
      soldQuantity: 0,
      saleStart: data.saleStart,
      saleEnd: data.saleEnd,
      status: 'active',
    });

    return ticketType;
  }

  async obtenerPorId(id: string): Promise<TicketType> {
    const ticketType = await this.ticketTypeRepository.obtenerPorId(id);
    if (!ticketType) {
      throw new CustomError('Tipo de entrada no encontrado', 404);
    }
    return ticketType;
  }

  async listarPorEvent(eventId: string): Promise<TicketType[]> {
    return this.ticketTypeRepository.listarPorEvent(eventId);
  }

  async actualizar(id: string, companyId: string, data: UpdateTicketTypeDTO): Promise<TicketType> {
    const ticketType = await this.ticketTypeRepository.obtenerPorId(id);
    if (!ticketType) {
      throw new CustomError('Tipo de entrada no encontrado', 404);
    }

    const event = await this.eventRepository.obtenerPorId(ticketType.eventId);
    if (!event || event.companyId !== companyId) {
      throw new CustomError('No tiene permisos para editar este tipo de entrada', 403);
    }

    if (data.totalQuantity !== undefined && data.totalQuantity < ticketType.soldQuantity) {
      throw new CustomError(
        'La cantidad total no puede ser menor a las entradas ya vendidas',
        400
      );
    }

    return this.ticketTypeRepository.actualizar(id, data);
  }

  async eliminar(id: string, companyId: string): Promise<void> {
    const ticketType = await this.ticketTypeRepository.obtenerPorId(id);
    if (!ticketType) {
      throw new CustomError('Tipo de entrada no encontrado', 404);
    }

    const event = await this.eventRepository.obtenerPorId(ticketType.eventId);
    if (!event || event.companyId !== companyId) {
      throw new CustomError('No tiene permisos para eliminar este tipo de entrada', 403);
    }

    if (ticketType.soldQuantity > 0) {
      throw new CustomError(
        'No se puede eliminar un tipo de entrada que ya tiene ventas',
        400
      );
    }

    await this.ticketTypeRepository.eliminar(id);
  }
}
