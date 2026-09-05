import { Ticket } from '../../../domain/entities/Ticket';
import { TicketRepository } from '../../../ports/output/TicketRepository';
import { TicketModel, TicketDocument } from './TicketModel';

export class MongoTicketRepository implements TicketRepository {
  private toDomain(doc: TicketDocument): Ticket {
    return {
      id: doc._id.toString(),
      nombre: doc.nombre,
      apellido: doc.apellido,
      dni: doc.dni,
      facultad: doc.facultad,
      codigoQR: doc.codigoQR || undefined,
      fechaRegistro: doc.fechaRegistro,
      consumido: doc.consumido,
      fechaConsumo: doc.fechaConsumo || undefined,
    };
  }

  async crear(ticket: Ticket): Promise<Ticket> {
    const model = new TicketModel({
      nombre: ticket.nombre,
      apellido: ticket.apellido,
      dni: ticket.dni,
      facultad: ticket.facultad,
      consumido: ticket.consumido,
    });
    const saved = await model.save();
    return this.toDomain(saved);
  }

  async obtenerPorId(id: string): Promise<Ticket | null> {
    const doc = await TicketModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async obtenerPorDni(dni: string): Promise<Ticket | null> {
    const doc = await TicketModel.findOne({ dni });
    return doc ? this.toDomain(doc) : null;
  }

  async listar(): Promise<Ticket[]> {
    const docs = await TicketModel.find().sort({ fechaRegistro: -1 });
    return docs.map((doc) => this.toDomain(doc));
  }

  async actualizar(id: string, data: Partial<Ticket>): Promise<Ticket> {
    const doc = await TicketModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) throw new Error('Ticket no encontrado');
    return this.toDomain(doc);
  }

  async eliminar(id: string): Promise<void> {
    await TicketModel.findByIdAndDelete(id);
  }

  async contarPorFacultad(): Promise<Record<string, number>> {
    const result = await TicketModel.aggregate([
      { $group: { _id: '$facultad', count: { $sum: 1 } } },
    ]);
    const counts: Record<string, number> = {};
    result.forEach((item) => {
      counts[item._id] = item.count;
    });
    return counts;
  }

  async contarPorDia(): Promise<Record<string, number>> {
    const result = await TicketModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$fechaRegistro' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
    ]);
    const counts: Record<string, number> = {};
    result.forEach((item) => {
      counts[item._id] = item.count;
    });
    return counts;
  }

  async contarConsumidos(): Promise<number> {
    return TicketModel.countDocuments({ consumido: true });
  }
}
