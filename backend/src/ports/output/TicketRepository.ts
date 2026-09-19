import { Ticket } from '../../domain/entities/Ticket';

export interface TicketRepository {
  crearMany(tickets: Ticket[], session?: any): Promise<Ticket[]>;
  obtenerPorId(id: string): Promise<Ticket | null>;
  obtenerPorCode(code: string): Promise<Ticket | null>;
  listarPorUser(userId: string): Promise<Ticket[]>;
  listarPorOrder(orderId: string): Promise<Ticket[]>;
  listarPorEvent(eventId: string): Promise<Ticket[]>;
  contarPorEvent(eventId: string): Promise<{ total: number; active: number; used: number; cancelled: number }>;
  contarPorUserYEvent(userId: string, eventId: string): Promise<number>;
  checkIn(code: string, staffId: string): Promise<Ticket>;
  actualizar(id: string, data: Partial<Ticket>): Promise<Ticket>;
}
