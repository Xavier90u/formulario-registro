import { Ticket } from '../../domain/entities/Ticket';

export interface TicketPdfData {
  ticket: Ticket;
  eventName: string;
  eventDate: Date;
  eventTime?: string;
  eventVenue: string;
  eventAddress?: string;
  ticketTypeName: string;
  companyName: string;
}

export interface PdfPort {
  generarTicketPdf(data: TicketPdfData): Promise<Buffer>;
}
