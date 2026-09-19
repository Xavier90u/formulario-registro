import { TicketType } from '../../../../domain/entities/TicketType';
import { TicketTypeRepository } from '../../../../ports/output/TicketTypeRepository';
import { TicketTypeModel, TicketTypeDocument } from '../models/TicketTypeModel';

function toDomain(doc: any): TicketType {
  return {
    id: doc._id.toString(),
    eventId: doc.eventId.toString(),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    totalQuantity: doc.totalQuantity,
    soldQuantity: doc.soldQuantity,
    saleStart: doc.saleStart,
    saleEnd: doc.saleEnd,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoTicketTypeRepository implements TicketTypeRepository {
  async crear(ticketType: TicketType): Promise<TicketType> {
    const model = new TicketTypeModel({
      eventId: ticketType.eventId,
      name: ticketType.name,
      description: ticketType.description,
      price: ticketType.price,
      totalQuantity: ticketType.totalQuantity,
      soldQuantity: ticketType.soldQuantity,
      saleStart: ticketType.saleStart,
      saleEnd: ticketType.saleEnd,
      status: ticketType.status,
    });
    const saved = await model.save();
    return toDomain(saved);
  }

  async obtenerPorId(id: string): Promise<TicketType | null> {
    const doc = await TicketTypeModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async listarPorEvent(eventId: string): Promise<TicketType[]> {
    const docs = await TicketTypeModel.find({ eventId }).sort({ price: 1 });
    return docs.map(toDomain);
  }

  async actualizar(id: string, data: Partial<TicketType>): Promise<TicketType> {
    const doc = await TicketTypeModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) throw new Error('Tipo de entrada no encontrado');
    return toDomain(doc);
  }

  async eliminar(id: string): Promise<void> {
    await TicketTypeModel.findByIdAndDelete(id);
  }

  async incrementarVendidos(id: string, cantidad: number, session?: any): Promise<TicketType> {
    const options: any = { new: true };
    if (session) options.session = session;

    const doc = await TicketTypeModel.findByIdAndUpdate(
      id,
      { $inc: { soldQuantity: cantidad } },
      options
    );

    if (!doc) throw new Error('Tipo de entrada no encontrado');

    if (doc.soldQuantity >= doc.totalQuantity) {
      doc.status = 'sold_out';
      await doc.save(options);
    }

    return toDomain(doc);
  }
}
