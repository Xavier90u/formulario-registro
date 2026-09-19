import { Order, OrderItem } from '../../domain/entities/Order';

export interface OrderRepository {
  crear(order: Order, items: Omit<OrderItem, 'id' | 'orderId'>[], session?: any): Promise<{ order: Order; items: OrderItem[] }>;
  obtenerPorId(id: string): Promise<Order | null>;
  obtenerConItems(id: string): Promise<{ order: Order; items: OrderItem[] } | null>;
  listarPorUser(userId: string): Promise<Order[]>;
  listarPorEvent(eventId: string): Promise<Order[]>;
  contarPorEvent(eventId: string): Promise<{ total: number; confirmed: number; pending: number; cancelled: number; totalRevenue: number }>;
  actualizarEstado(id: string, status: Order['status']): Promise<Order>;
  generarNumeroOrden(): Promise<string>;
}
