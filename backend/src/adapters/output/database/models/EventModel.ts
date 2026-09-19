import mongoose, { Schema, Document } from 'mongoose';
import { Event } from '../../../../domain/entities/Event';

export interface EventDocument extends Omit<Event, 'id'>, Document {}

const EventSchema = new Schema<EventDocument>(
  {
    companyId: { type: Schema.Types.ObjectId as any, ref: 'Company', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String },
    date: { type: Date, required: true },
    time: { type: String, trim: true },
    venue: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'active', 'sold_out', 'finished', 'cancelled'],
      default: 'draft',
    },
    maxTicketsPerUser: { type: Number, default: 4, min: 1, max: 50 },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

EventSchema.index({ companyId: 1 });
EventSchema.index({ companyId: 1, slug: 1 }, { unique: true });
EventSchema.index({ status: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ isPublished: 1, date: 1 });

export const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
