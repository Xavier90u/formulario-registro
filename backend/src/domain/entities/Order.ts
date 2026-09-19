export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id?: string;
  userId: string;
  eventId: string;
  companyId: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  id?: string;
  orderId: string;
  ticketTypeId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt?: Date;
}

export interface CreateOrderDTO {
  eventId: string;
  items: {
    ticketTypeId: string;
    quantity: number;
  }[];
}

export interface OrderResponse {
  order: Order;
  items: OrderItem[];
  tickets: {
    code: string;
    ticketTypeName: string;
    qrImage?: string;
  }[];
}
