import mongoose, { Schema, Document } from 'mongoose';
import { TicketType } from '../../../../domain/entities/TicketType';

export interface TicketTypeDocument extends Omit<TicketType, 'id'>, Document {}

const TicketTypeSchema = new Schema<TicketTypeDocument>(
  {
    eventId: { type: Schema.Types.ObjectId as any, ref: 'Event', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    totalQuantity: { type: Number, required: true, min: 0 },
    soldQuantity: { type: Number, default: 0, min: 0 },
    saleStart: { type: Date },
    saleEnd: { type: Date },
    status: {
      type: String,
      enum: ['active', 'inactive', 'sold_out'],
      default: 'active',
    },
  },
  { timestamps: true }
);

TicketTypeSchema.index({ eventId: 1 });
TicketTypeSchema.index({ eventId: 1, status: 1 });

export const TicketTypeModel = mongoose.model<TicketTypeDocument>('TicketType', TicketTypeSchema);
