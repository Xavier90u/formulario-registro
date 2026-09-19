import mongoose, { Schema, Document } from 'mongoose';
import { Company } from '../../../../domain/entities/Company';

export interface CompanyDocument extends Omit<Company, 'id'>, Document {}

const CompanySchema = new Schema<CompanyDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    description: { type: String, trim: true },
    logo: { type: String },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  { timestamps: true }
);

CompanySchema.index({ slug: 1 });
CompanySchema.index({ status: 1 });

export const CompanyModel = mongoose.model<CompanyDocument>('Company', CompanySchema);
