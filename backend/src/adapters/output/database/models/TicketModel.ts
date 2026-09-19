import mongoose, { Schema, Document } from 'mongoose';
import { Ticket } from '../../../../domain/entities/Ticket';

export interface TicketDocument extends Omit<Ticket, 'id'>, Document {}

const TicketSchema = new Schema<TicketDocument>(
  {
    orderId: { type: Schema.Types.ObjectId as any, ref: 'Order', required: true },
    orderItemId: { type: Schema.Types.ObjectId as any, ref: 'OrderItem', required: true },
    ticketTypeId: { type: Schema.Types.ObjectId as any, ref: 'TicketType', required: true },
    eventId: { type: Schema.Types.ObjectId as any, ref: 'Event', required: true },
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
    companyId: { type: Schema.Types.ObjectId as any, ref: 'Company', required: true },
    code: { type: String, required: true, unique: true },
    qrData: { type: String },
    qrImage: { type: String },
    status: {
      type: String,
      enum: ['active', 'used', 'cancelled'],
      default: 'active',
    },
    checkedInAt: { type: Date },
    checkedInBy: { type: Schema.Types.ObjectId as any, ref: 'User' },
    buyerName: { type: String, required: true, trim: true },
    buyerDni: { type: String, default: '' },
    buyerEmail: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

TicketSchema.index({ code: 1 });
TicketSchema.index({ userId: 1 });
TicketSchema.index({ eventId: 1 });
TicketSchema.index({ orderId: 1 });
TicketSchema.index({ companyId: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ userId: 1, eventId: 1 });

export const TicketModel = mongoose.model<TicketDocument>('Ticket', TicketSchema);
