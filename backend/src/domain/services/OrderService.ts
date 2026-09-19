import { CreateOrderDTO, Order, OrderItem, OrderResponse } from '../../domain/entities/Order';
import { OrderUseCase } from '../../ports/input/OrderUseCase';
import { OrderRepository } from '../../ports/output/OrderRepository';
import { EventRepository } from '../../ports/output/EventRepository';
import { TicketTypeRepository } from '../../ports/output/TicketTypeRepository';
import { TicketRepository } from '../../ports/output/TicketRepository';
import { UserRepository } from '../../ports/output/UserRepository';
import { QrCodePort } from '../../ports/output/QrCodePort';
import { CustomError } from '../../shared/errors/CustomError';
import { withTransaction } from '../../shared/utils/helpers';
import { v4 as uuidv4 } from 'uuid';

export class OrderService implements OrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventRepository: EventRepository,
    private readonly ticketTypeRepository: TicketTypeRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly userRepository: UserRepository,
    private readonly qrService: QrCodePort
  ) {}

  async crear(userId: string, data: CreateOrderDTO): Promise<OrderResponse> {
    const user = await this.userRepository.obtenerPorId(userId);
    if (!user) {
      throw new CustomError('Usuario no encontrado', 404);
    }

    const event = await this.eventRepository.obtenerPorId(data.eventId);
    if (!event) {
      throw new CustomError('Evento no encontrado', 404);
    }

    if (event.status !== 'active' && event.status !== 'published') {
      throw new CustomError('El evento no está disponible para compras', 400);
    }

      const ticketTypeIds = data.items.map((item) => item.ticketTypeId);
    const ticketTypesResults = await Promise.all(
      ticketTypeIds.map((id) => this.ticketTypeRepository.obtenerPorId(id))
    );

    for (let i = 0; i < ticketTypesResults.length; i++) {
      const tt = ticketTypesResults[i];
      if (!tt) {
        throw new CustomError(`Tipo de entrada no encontrado: ${ticketTypeIds[i]}`, 400);
      }
      if (tt.eventId !== data.eventId) {
        throw new CustomError('Los tipos de entrada no pertenecen a este evento', 400);
      }
      if (tt.status !== 'active') {
        throw new CustomError(`El tipo de entrada "${tt.name}" no está disponible`, 400);
      }
    }

    const ticketTypes = ticketTypesResults as NonNullable<(typeof ticketTypesResults)[0]>[];

    const userTicketCount = await this.ticketRepository.contarPorUserYEvent(
      userId,
      data.eventId
    );
    const totalRequested = data.items.reduce((sum, item) => sum + item.quantity, 0);

    if (userTicketCount + totalRequested > event.maxTicketsPerUser) {
      throw new CustomError(
        `Excede el límite de ${event.maxTicketsPerUser} entradas por usuario para este evento`,
        400
      );
    }

    let totalAmount = 0;
    const orderItems: Omit<OrderItem, 'id' | 'orderId'>[] = [];

    for (const item of data.items) {
      const tt = ticketTypes.find((t) => t.id === item.ticketTypeId)!;
      const available = tt.totalQuantity - tt.soldQuantity;

      if (available < item.quantity) {
        throw new CustomError(
          `No hay suficientes entradas disponibles para "${tt.name}". Disponibles: ${available}`,
          400
        );
      }

      const subtotal = tt.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity,
        unitPrice: tt.price,
        subtotal,
      });
    }

    const result = await withTransaction(async (session) => {
      for (const item of data.items) {
        await this.ticketTypeRepository.incrementarVendidos(
          item.ticketTypeId,
          item.quantity,
          session
        );
      }

      const orderNumber = await this.orderRepository.generarNumeroOrden();

      const { order, items: savedItems } = await this.orderRepository.crear(
        {
          userId,
          eventId: data.eventId,
          companyId: event.companyId,
          orderNumber,
          status: 'confirmed',
          totalAmount,
          paymentStatus: 'paid',
        },
        orderItems,
        session
      );

      const ticketsToCreate: any[] = [];
      const ticketResponses: OrderResponse['tickets'] = [];

      for (const savedItem of savedItems) {
        const tt = ticketTypes.find((t) => t.id === savedItem.ticketTypeId)!;

        for (let i = 0; i < savedItem.quantity; i++) {
          const code = uuidv4();
          const ttName = tt!.name;
          const qrData = JSON.stringify({
            code,
            eventId: data.eventId,
            ticketType: ttName,
          });

          let qrImage: string | undefined;
          try {
            qrImage = await this.qrService.generarQR(qrData);
          } catch {
            qrImage = undefined;
          }

          ticketsToCreate.push({
            orderId: order.id!,
            orderItemId: savedItem.id!,
            ticketTypeId: savedItem.ticketTypeId,
            eventId: data.eventId,
            userId,
            companyId: event.companyId,
            code,
            qrData,
            qrImage,
            status: 'active' as const,
            buyerName: user.nombre,
            buyerDni: '',
            buyerEmail: user.email,
          });

          ticketResponses.push({
            code,
            ticketTypeName: ttName,
            qrImage,
          });
        }
      }

      await this.ticketRepository.crearMany(ticketsToCreate, session);

      return { order, items: savedItems, tickets: ticketResponses };
    });

    return result;
  }

  async obtenerPorId(id: string, userId?: string): Promise<OrderResponse> {
    const result = await this.orderRepository.obtenerConItems(id);
    if (!result) {
      throw new CustomError('Orden no encontrada', 404);
    }

    if (userId && result.order.userId !== userId) {
      throw new CustomError('No tiene permisos para ver esta orden', 403);
    }

    const tickets = await this.ticketRepository.listarPorOrder(id);

    return {
      order: result.order,
      items: result.items,
      tickets: tickets.map((t) => ({
        code: t.code,
        ticketTypeName: '',
        qrImage: t.qrImage,
      })),
    };
  }

  async listarPorUser(userId: string): Promise<Order[]> {
    return this.orderRepository.listarPorUser(userId);
  }

  async listarPorEvent(eventId: string, companyId: string): Promise<Order[]> {
    const event = await this.eventRepository.obtenerPorId(eventId);
    if (!event || event.companyId !== companyId) {
      throw new CustomError('Evento no encontrado o sin permisos', 404);
    }
    return this.orderRepository.listarPorEvent(eventId);
  }

  async contarPorEvent(
    eventId: string,
    companyId: string
  ): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    const event = await this.eventRepository.obtenerPorId(eventId);
    if (!event || event.companyId !== companyId) {
      throw new CustomError('Evento no encontrado o sin permisos', 404);
    }
    return this.orderRepository.contarPorEvent(eventId);
  }

  async cancelar(id: string, userId: string): Promise<Order> {
    const result = await this.orderRepository.obtenerConItems(id);
    if (!result) {
      throw new CustomError('Orden no encontrada', 404);
    }

    if (result.order.userId !== userId) {
      throw new CustomError('No tiene permisos para cancelar esta orden', 403);
    }

    if (result.order.status !== 'confirmed' && result.order.status !== 'pending') {
      throw new CustomError('No se puede cancelar esta orden', 400);
    }

    const order = await this.orderRepository.actualizarEstado(id, 'cancelled');

    for (const item of result.items) {
      await this.ticketTypeRepository.incrementarVendidos(
        item.ticketTypeId,
        -item.quantity
      );
    }

    return order;
  }
}
