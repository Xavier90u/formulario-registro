import { Order, OrderItem } from '../../../../domain/entities/Order';
import { OrderRepository } from '../../../../ports/output/OrderRepository';
import { OrderModel, OrderDocument } from '../models/OrderModel';
import { OrderItemModel, OrderItemDocument } from '../models/OrderItemModel';

function orderToDomain(doc: any): Order {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    eventId: doc.eventId.toString(),
    companyId: doc.companyId.toString(),
    orderNumber: doc.orderNumber,
    status: doc.status,
    totalAmount: doc.totalAmount,
    paymentMethod: doc.paymentMethod,
    paymentStatus: doc.paymentStatus,
    paymentId: doc.paymentId,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function itemToDomain(doc: any): OrderItem {
  return {
    id: doc._id.toString(),
    orderId: doc.orderId.toString(),
    ticketTypeId: doc.ticketTypeId.toString(),
    quantity: doc.quantity,
    unitPrice: doc.unitPrice,
    subtotal: doc.subtotal,
    createdAt: doc.createdAt,
  };
}

export class MongoOrderRepository implements OrderRepository {
  async crear(
    order: Order,
    items: Omit<OrderItem, 'id' | 'orderId'>[],
    session?: any
  ): Promise<{ order: Order; items: OrderItem[] }> {
    const options: any = {};
    if (session) options.session = session;

    const orderModel = new OrderModel({
      userId: order.userId,
      eventId: order.eventId,
      companyId: order.companyId,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    });

    const savedOrder = await orderModel.save(options);

    const itemModels = items.map(
      (item) =>
        new OrderItemModel({
          orderId: savedOrder._id,
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })
    );

    const savedItems = await OrderItemModel.insertMany(itemModels, options);

    return {
      order: orderToDomain(savedOrder),
      items: savedItems.map(itemToDomain),
    };
  }

  async obtenerPorId(id: string): Promise<Order | null> {
    const doc = await OrderModel.findById(id);
    return doc ? orderToDomain(doc) : null;
  }

  async obtenerConItems(id: string): Promise<{ order: Order; items: OrderItem[] } | null> {
    const doc = await OrderModel.findById(id);
    if (!doc) return null;

    const items = await OrderItemModel.find({ orderId: id });
    return {
      order: orderToDomain(doc),
      items: items.map(itemToDomain),
    };
  }

  async listarPorUser(userId: string): Promise<Order[]> {
    const docs = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map(orderToDomain);
  }

  async listarPorEvent(eventId: string): Promise<Order[]> {
    const docs = await OrderModel.find({ eventId }).sort({ createdAt: -1 });
    return docs.map(orderToDomain);
  }

  async contarPorEvent(eventId: string): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    const results = await OrderModel.aggregate([
      { $match: { eventId: eventId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    const counts = {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      totalRevenue: 0,
    };

    results.forEach((r) => {
      (counts as any)[r._id] = r.count;
      counts.total += r.count;
      if (r._id === 'confirmed') {
        counts.totalRevenue = r.revenue;
      }
    });

    return counts;
  }

  async actualizarEstado(id: string, status: Order['status']): Promise<Order> {
    const doc = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!doc) throw new Error('Orden no encontrada');
    return orderToDomain(doc);
  }

  async generarNumeroOrden(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await OrderModel.countDocuments({
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      },
    });
    const seq = String(count + 1).padStart(4, '0');
    return `ORD-${dateStr}-${seq}`;
  }
}
