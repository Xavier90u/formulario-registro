import { Ticket } from '../../domain/entities/Ticket';

export interface TicketRepository {
  crear(ticket: Ticket): Promise<Ticket>;
  obtenerPorId(id: string): Promise<Ticket | null>;
  obtenerPorDni(dni: string): Promise<Ticket | null>;
  listar(): Promise<Ticket[]>;
  actualizar(id: string, data: Partial<Ticket>): Promise<Ticket>;
  eliminar(id: string): Promise<void>;
  contarPorFacultad(): Promise<Record<string, number>>;
  contarPorDia(): Promise<Record<string, number>>;
  contarConsumidos(): Promise<number>;
}
