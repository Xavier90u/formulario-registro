import { Router } from 'express';
import { AuthController } from '../AuthController';
import { authMiddleware } from '../../../../shared/middleware/auth';
import { validate } from '../../../../shared/middleware/validate';
import { LoginSchema, RegisterSchema, UpdateProfileSchema } from '../../../../shared/utils/validator';

export const createAuthRoutes = (controller: AuthController): Router => {
  const router = Router();

  router.post('/login', validate(LoginSchema), controller.login);
  router.post('/register', validate(RegisterSchema), controller.register);
  router.get('/profile', authMiddleware, controller.getProfile);
  router.put('/profile', authMiddleware, validate(UpdateProfileSchema), controller.updateProfile);

  return router;
};
