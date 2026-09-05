import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../AuthController';
import jwt from 'jsonwebtoken';
import { config } from '../../../../config/env';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Token no proporcionado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

export const createAuthRoutes = (controller: AuthController): Router => {
  const router = Router();

  router.post('/login', controller.login);
  router.post('/register', controller.register);
  router.get('/profile', authMiddleware, controller.getProfile);

  return router;
};
