import { Ticket } from '../../domain/entities/Ticket';
import { TicketPdfData } from '../output/PdfPort';

export interface TicketUseCase {
  listarPorUser(userId: string): Promise<Ticket[]>;
  obtenerPorCode(code: string): Promise<Ticket>;
  obtenerPdfData(code: string): Promise<TicketPdfData>;
  checkIn(code: string, staffId: string, companyId: string): Promise<Ticket>;
}
