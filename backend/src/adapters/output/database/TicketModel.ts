import mongoose, { Schema, Document } from 'mongoose';
import { Ticket } from '../../../domain/entities/Ticket';

export interface TicketDocument extends Omit<Ticket, 'id'>, Document {}

const TicketSchema = new Schema<TicketDocument>(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    dni: { type: String, required: true, unique: true, immutable: true },
    facultad: { type: String, required: true },
    codigoQR: { type: String, default: null },
    consumido: { type: Boolean, default: false },
    fechaConsumo: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'fechaRegistro', updatedAt: false },
  }
);

TicketSchema.index({ dni: 1 }, { unique: true });

export const TicketModel = mongoose.model<TicketDocument>('Ticket', TicketSchema);
