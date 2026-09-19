import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { CustomError } from '../errors/CustomError';

export const validate = (schema: ZodSchema, source: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (error: any) {
      if (error.errors) {
        const message = error.errors.map((e: any) => e.message).join(', ');
        throw new CustomError(message, 400);
      }
      throw new CustomError('Error de validación', 400);
    }
  };
};
