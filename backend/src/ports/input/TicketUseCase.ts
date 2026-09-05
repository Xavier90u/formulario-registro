import { CrearTicketDTO, ConsumirTicketDTO, Ticket, TicketConsumidoResponse, Estadisticas } from '../../domain/entities/Ticket';

export interface TicketUseCase {
  crearTicket(data: CrearTicketDTO): Promise<Ticket>;
  consumirTicket(data: ConsumirTicketDTO): Promise<TicketConsumidoResponse>;
  obtenerTicketPorId(id: string): Promise<Ticket>;
  obtenerTicketPorDni(dni: string): Promise<Ticket>;
  listarTodos(): Promise<Ticket[]>;
  obtenerEstadisticas(): Promise<Estadisticas>;
}
