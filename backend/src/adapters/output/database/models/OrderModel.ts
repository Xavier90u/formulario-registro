import mongoose, { Schema, Document } from 'mongoose';
import { Order } from '../../../../domain/entities/Order';

export interface OrderDocument extends Omit<Order, 'id'>, Document {}

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId as any, ref: 'Event', required: true },
    companyId: { type: Schema.Types.ObjectId as any, ref: 'Company', required: true },
    orderNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ eventId: 1 });
OrderSchema.index({ companyId: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);
