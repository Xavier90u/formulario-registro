import { Event, EventStatus } from '../../../../domain/entities/Event';
import { EventRepository } from '../../../../ports/output/EventRepository';
import { EventModel, EventDocument } from '../models/EventModel';

function toDomain(doc: any): Event {
  const companyIdData = doc.companyId;
  let companyIdString = '';
  let company = undefined;

  if (companyIdData && typeof companyIdData === 'object' && companyIdData._id) {
    companyIdString = companyIdData._id.toString();
    company = {
      id: companyIdData._id.toString(),
      name: companyIdData.name,
      slug: companyIdData.slug,
      logo: companyIdData.logo,
    };
  } else {
    companyIdString = companyIdData?.toString() || '';
  }

  return {
    id: doc._id.toString(),
    companyId: companyIdString,
    company,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    image: doc.image,
    date: doc.date,
    time: doc.time,
    venue: doc.venue,
    address: doc.address,
    status: doc.status,
    maxTicketsPerUser: doc.maxTicketsPerUser,
    isPublished: doc.isPublished,
    publishedAt: doc.publishedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoEventRepository implements EventRepository {
  async crear(event: Event): Promise<Event> {
    const model = new EventModel({
      companyId: event.companyId,
      name: event.name,
      slug: event.slug,
      description: event.description,
      image: event.image,
      date: event.date,
      time: event.time,
      venue: event.venue,
      address: event.address,
      status: event.status,
      maxTicketsPerUser: event.maxTicketsPerUser,
      isPublished: event.isPublished,
    });
    const saved = await model.save();
    return toDomain(saved);
  }

  async obtenerPorId(id: string): Promise<Event | null> {
    const doc = await EventModel.findById(id).populate('companyId', 'name slug logo');
    return doc ? toDomain(doc) : null;
  }

  async obtenerPorSlug(companyId: string, slug: string): Promise<Event | null> {
    const doc = await EventModel.findOne({ companyId, slug });
    return doc ? toDomain(doc) : null;
  }

  async listarPorCompany(companyId: string, filtros?: { status?: EventStatus }): Promise<Event[]> {
    const query: any = { companyId };
    if (filtros?.status) query.status = filtros.status;
    const docs = await EventModel.find(query).sort({ date: -1 });
    return docs.map(toDomain);
  }

  async listarPublicados(filtros?: { search?: string; date?: string }): Promise<Event[]> {
    const query: any = { isPublished: true, status: { $in: ['published', 'active'] } };

    if (filtros?.search) {
      query.$or = [
        { name: { $regex: filtros.search, $options: 'i' } },
        { venue: { $regex: filtros.search, $options: 'i' } },
        { description: { $regex: filtros.search, $options: 'i' } },
      ];
    }

    if (filtros?.date) {
      const targetDate = new Date(filtros.date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: targetDate, $lt: nextDay };
    }

    const docs = await EventModel.find(query)
      .populate('companyId', 'name slug logo')
      .sort({ date: 1 });
    return docs.map((doc) => toDomain(doc as any));
  }

  async actualizar(id: string, data: Partial<Event>): Promise<Event> {
    const doc = await EventModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) throw new Error('Evento no encontrado');
    return toDomain(doc);
  }

  async eliminar(id: string): Promise<void> {
    await EventModel.findByIdAndDelete(id);
  }

  async contarPorCompany(companyId: string): Promise<{
    total: number;
    active: number;
    draft: number;
    published: number;
    finished: number;
    sold_out: number;
    cancelled: number;
  }> {
    const results = await EventModel.aggregate([
      { $match: { companyId: companyId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const counts = {
      total: 0,
      active: 0,
      draft: 0,
      published: 0,
      finished: 0,
      sold_out: 0,
      cancelled: 0,
    };

    results.forEach((r) => {
      (counts as any)[r._id] = r.count;
      counts.total += r.count;
    });

    return counts;
  }
}
