import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../../domain/entities/User';

export interface UserDocument extends Omit<User, 'id'>, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true, trim: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
