export interface TicketType {
  id?: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  saleStart?: Date;
  saleEnd?: Date;
  status: 'active' | 'inactive' | 'sold_out';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTicketTypeDTO {
  name: string;
  description?: string;
  price: number;
  totalQuantity: number;
  saleStart?: Date;
  saleEnd?: Date;
}

export interface UpdateTicketTypeDTO {
  name?: string;
  description?: string;
  price?: number;
  totalQuantity?: number;
  saleStart?: Date;
  saleEnd?: Date;
  status?: 'active' | 'inactive' | 'sold_out';
}
