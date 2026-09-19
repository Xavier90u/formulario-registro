import mongoose, { Schema, Document } from 'mongoose';
import { OrderItem } from '../../../../domain/entities/Order';

export interface OrderItemDocument extends Omit<OrderItem, 'id'>, Document {}

const OrderItemSchema = new Schema<OrderItemDocument>(
  {
    orderId: { type: Schema.Types.ObjectId as any, ref: 'Order', required: true },
    ticketTypeId: { type: Schema.Types.ObjectId as any, ref: 'TicketType', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

OrderItemSchema.index({ orderId: 1 });
OrderItemSchema.index({ ticketTypeId: 1 });

export const OrderItemModel = mongoose.model<OrderItemDocument>('OrderItem', OrderItemSchema);
