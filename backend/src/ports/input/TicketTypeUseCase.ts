import { TicketType, CreateTicketTypeDTO, UpdateTicketTypeDTO } from '../../domain/entities/TicketType';

export interface TicketTypeUseCase {
  crear(eventId: string, companyId: string, data: CreateTicketTypeDTO): Promise<TicketType>;
  obtenerPorId(id: string): Promise<TicketType>;
  listarPorEvent(eventId: string): Promise<TicketType[]>;
  actualizar(id: string, companyId: string, data: UpdateTicketTypeDTO): Promise<TicketType>;
  eliminar(id: string, companyId: string): Promise<void>;
}
