import { Ticket } from '../../../../domain/entities/Ticket';
import { TicketRepository } from '../../../../ports/output/TicketRepository';
import { TicketModel, TicketDocument } from '../models/TicketModel';
import { CustomError } from '../../../../shared/errors/CustomError';

function toDomain(doc: any): Ticket {
  return {
    id: doc._id.toString(),
    orderId: doc.orderId.toString(),
    orderItemId: doc.orderItemId.toString(),
    ticketTypeId: doc.ticketTypeId.toString(),
    eventId: doc.eventId.toString(),
    userId: doc.userId.toString(),
    companyId: doc.companyId.toString(),
    code: doc.code,
    qrData: doc.qrData,
    qrImage: doc.qrImage,
    status: doc.status,
    checkedInAt: doc.checkedInAt,
    checkedInBy: doc.checkedInBy?.toString(),
    buyerName: doc.buyerName,
    buyerDni: doc.buyerDni,
    buyerEmail: doc.buyerEmail,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoTicketRepository implements TicketRepository {
  async crearMany(tickets: Ticket[], session?: any): Promise<Ticket[]> {
    const options: any = {};
    if (session) options.session = session;

    const models = tickets.map(
      (t) =>
        new TicketModel({
          orderId: t.orderId,
          orderItemId: t.orderItemId,
          ticketTypeId: t.ticketTypeId,
          eventId: t.eventId,
          userId: t.userId,
          companyId: t.companyId,
          code: t.code,
          qrData: t.qrData,
          qrImage: t.qrImage,
          status: t.status,
          buyerName: t.buyerName,
          buyerDni: t.buyerDni,
          buyerEmail: t.buyerEmail,
        })
    );

    const saved = await TicketModel.insertMany(models, options);
    return saved.map((doc) => toDomain(doc));
  }

  async obtenerPorId(id: string): Promise<Ticket | null> {
    const doc = await TicketModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async obtenerPorCode(code: string): Promise<Ticket | null> {
    const doc = await TicketModel.findOne({ code });
    return doc ? toDomain(doc) : null;
  }

  async listarPorUser(userId: string): Promise<Ticket[]> {
    const docs = await TicketModel.find({ userId })
      .populate('eventId', 'name date venue')
      .populate('ticketTypeId', 'name')
      .sort({ createdAt: -1 });
    return docs.map((doc) => toDomain(doc));
  }

  async listarPorOrder(orderId: string): Promise<Ticket[]> {
    const docs = await TicketModel.find({ orderId }).sort({ createdAt: -1 });
    return docs.map((doc) => toDomain(doc));
  }

  async listarPorEvent(eventId: string): Promise<Ticket[]> {
    const docs = await TicketModel.find({ eventId })
      .populate('userId', 'nombre email')
      .populate('ticketTypeId', 'name')
      .sort({ createdAt: -1 });
    return docs.map((doc) => toDomain(doc));
  }

  async contarPorEvent(eventId: string): Promise<{
    total: number;
    active: number;
    used: number;
    cancelled: number;
  }> {
    const results = await TicketModel.aggregate([
      { $match: { eventId: eventId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const counts = { total: 0, active: 0, used: 0, cancelled: 0 };
    results.forEach((r) => {
      (counts as any)[r._id] = r.count;
      counts.total += r.count;
    });

    return counts;
  }

  async contarPorUserYEvent(userId: string, eventId: string): Promise<number> {
    return TicketModel.countDocuments({
      userId,
      eventId,
      status: { $ne: 'cancelled' },
    });
  }

  async checkIn(code: string, staffId: string): Promise<Ticket> {
    const doc = await TicketModel.findOne({ code });
    if (!doc) throw new CustomError('Entrada no encontrada', 404);
    if (doc.status === 'used') {
      throw new CustomError('Esta entrada ya fue utilizada', 409);
    }
    if (doc.status === 'cancelled') {
      throw new CustomError('Esta entrada fue cancelada', 400);
    }

    doc.status = 'used';
    doc.checkedInAt = new Date();
    doc.checkedInBy = staffId as any;
    await doc.save();

    return toDomain(doc);
  }

  async actualizar(id: string, data: Partial<Ticket>): Promise<Ticket> {
    const doc = await TicketModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) throw new Error('Entrada no encontrada');
    return toDomain(doc);
  }
}
