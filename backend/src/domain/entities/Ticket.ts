export type TicketStatus = 'active' | 'used' | 'cancelled';

export interface Ticket {
  id?: string;
  orderId: string;
  orderItemId: string;
  ticketTypeId: string;
  eventId: string;
  userId: string;
  companyId: string;
  code: string;
  qrData?: string;
  qrImage?: string;
  status: TicketStatus;
  checkedInAt?: Date;
  checkedInBy?: string;
  buyerName: string;
  buyerDni: string;
  buyerEmail: string;
  createdAt?: Date;
  updatedAt?: Date;
}
