import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../../../domain/entities/User';

export interface UserDocument extends Omit<User, 'id'>, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['superadmin', 'company_admin', 'company_staff', 'customer'],
      default: 'customer',
    },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ companyId: 1 });
UserSchema.index({ role: 1 });

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
