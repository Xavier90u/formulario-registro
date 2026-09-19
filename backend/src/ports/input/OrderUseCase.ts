import { CreateOrderDTO, Order, OrderResponse } from '../../domain/entities/Order';

export interface OrderUseCase {
  crear(userId: string, data: CreateOrderDTO): Promise<OrderResponse>;
  obtenerPorId(id: string, userId?: string): Promise<OrderResponse>;
  listarPorUser(userId: string): Promise<Order[]>;
  listarPorEvent(eventId: string, companyId: string): Promise<Order[]>;
  contarPorEvent(eventId: string, companyId: string): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    totalRevenue: number;
  }>;
  cancelar(id: string, userId: string): Promise<Order>;
}
