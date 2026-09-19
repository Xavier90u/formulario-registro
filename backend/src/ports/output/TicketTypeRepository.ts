import { TicketType } from '../../domain/entities/TicketType';

export interface TicketTypeRepository {
  crear(ticketType: TicketType): Promise<TicketType>;
  obtenerPorId(id: string): Promise<TicketType | null>;
  listarPorEvent(eventId: string): Promise<TicketType[]>;
  actualizar(id: string, data: Partial<TicketType>): Promise<TicketType>;
  eliminar(id: string): Promise<void>;
  incrementarVendidos(id: string, cantidad: number, session?: any): Promise<TicketType>;
}
