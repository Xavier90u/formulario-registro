import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';
import { UserRole } from '../../domain/entities/User';

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new CustomError('No autenticado', 401);
    }

    if (!roles.includes(req.user.role as UserRole)) {
      throw new CustomError('No tiene permisos para realizar esta acción', 403);
    }

    next();
  };
};

export const requireCompanyAccess = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new CustomError('No autenticado', 401);
  }

  if (['superadmin'].includes(req.user.role)) {
    return next();
  }

  if (!req.user.companyId) {
    throw new CustomError('No está asociado a ninguna empresa', 403);
  }

  next();
};
