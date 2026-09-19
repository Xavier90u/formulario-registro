import { Company } from '../../../../domain/entities/Company';
import { CompanyRepository } from '../../../../ports/output/CompanyRepository';
import { CompanyModel, CompanyDocument } from '../models/CompanyModel';

function toDomain(doc: any): Company {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    description: doc.description,
    logo: doc.logo,
    slug: doc.slug,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoCompanyRepository implements CompanyRepository {
  async crear(company: Company): Promise<Company> {
    const model = new CompanyModel({
      name: company.name,
      email: company.email,
      phone: company.phone,
      description: company.description,
      logo: company.logo,
      slug: company.slug,
      status: company.status,
    });
    const saved = await model.save();
    return toDomain(saved);
  }

  async obtenerPorId(id: string): Promise<Company | null> {
    const doc = await CompanyModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async obtenerPorSlug(slug: string): Promise<Company | null> {
    const doc = await CompanyModel.findOne({ slug });
    return doc ? toDomain(doc) : null;
  }

  async obtenerPorEmail(email: string): Promise<Company | null> {
    const doc = await CompanyModel.findOne({ email: email.toLowerCase() });
    return doc ? toDomain(doc) : null;
  }

  async listar(filtros?: { status?: string }): Promise<Company[]> {
    const query: any = {};
    if (filtros?.status) query.status = filtros.status;
    const docs = await CompanyModel.find(query).sort({ name: 1 });
    return docs.map(toDomain);
  }

  async actualizar(id: string, data: Partial<Company>): Promise<Company> {
    const doc = await CompanyModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) throw new Error('Empresa no encontrada');
    return toDomain(doc);
  }

  async eliminar(id: string): Promise<void> {
    await CompanyModel.findByIdAndDelete(id);
  }
}
