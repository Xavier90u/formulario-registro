import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  phone: z.string().optional(),
});

export const UpdateProfileSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const CompanySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email no válido'),
  phone: z.string().optional(),
  description: z.string().max(500).optional(),
  logo: z.string().url().optional(),
  adminName: z.string().min(2, 'El nombre del admin es obligatorio').max(100),
  adminEmail: z.string().email('Email del admin no válido'),
  adminPassword: z.string().min(6, 'La contraseña del admin debe tener al menos 6 caracteres'),
});

export const UpdateCompanySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  description: z.string().max(500).optional(),
  logo: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

export const EventSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  description: z.string().max(2000).optional(),
  image: z.string().url().optional(),
  date: z.string().transform((val) => new Date(val)).or(z.date()),
  time: z.string().optional(),
  venue: z.string().min(1, 'El lugar es obligatorio').max(200),
  address: z.string().max(300).optional(),
  maxTicketsPerUser: z.number().int().min(1).max(50).default(4),
});

export const UpdateEventSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional(),
  image: z.string().url().optional(),
  date: z.string().transform((val) => new Date(val)).or(z.date()).optional(),
  time: z.string().optional(),
  venue: z.string().min(1).max(200).optional(),
  address: z.string().max(300).optional(),
  maxTicketsPerUser: z.number().int().min(1).max(50).optional(),
  status: z.enum(['draft', 'published', 'active', 'sold_out', 'finished', 'cancelled']).optional(),
});

export const TicketTypeSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  totalQuantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  saleStart: z.string().transform((val) => new Date(val)).or(z.date()).optional(),
  saleEnd: z.string().transform((val) => new Date(val)).or(z.date()).optional(),
});

export const UpdateTicketTypeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  price: z.number().min(0).optional(),
  totalQuantity: z.number().int().min(1).optional(),
  saleStart: z.string().transform((val) => new Date(val)).or(z.date()).optional(),
  saleEnd: z.string().transform((val) => new Date(val)).or(z.date()).optional(),
  status: z.enum(['active', 'inactive', 'sold_out']).optional(),
});

export const CreateOrderSchema = z.object({
  eventId: z.string().min(1, 'El evento es obligatorio'),
  items: z.array(z.object({
    ticketTypeId: z.string().min(1, 'El tipo de entrada es obligatorio'),
    quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1').max(50),
  })).min(1, 'Debe seleccionar al menos una entrada'),
});

export const CheckInSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio'),
});

export const UpdateCompanyStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended']),
});

export const EventStatusSchema = z.object({
  status: z.enum(['draft', 'published', 'active', 'sold_out', 'finished', 'cancelled']),
});
