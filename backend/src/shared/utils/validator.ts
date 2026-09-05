import { z } from 'zod';

export const TicketSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50),
  dni: z.string().regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos'),
  facultad: z.enum([
    'Ingeniería',
    'Medicina',
    'Derecho',
    'Economía',
    'Ciencias',
    'Humanidades',
  ], { errorMap: () => ({ message: 'Facultad no válida' }) }),
});

export const ConsumirTicketSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos'),
});

export const LoginSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  role: z.enum(['admin', 'user']).default('user'),
});
