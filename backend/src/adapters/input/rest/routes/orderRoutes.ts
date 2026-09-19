import { Router } from 'express';
import { OrderController } from '../OrderController';
import { authMiddleware } from '../../../../shared/middleware/auth';
import { validate } from '../../../../shared/middleware/validate';
import { CreateOrderSchema } from '../../../../shared/utils/validator';

export const createOrderRoutes = (controller: OrderController): Router => {
  const router = Router();

  router.use(authMiddleware);

  router.post('/', validate(CreateOrderSchema), controller.crear);
  router.get('/my', controller.listarPorUser);
  router.get('/event/:eventId', controller.listarPorEvent);
  router.get('/event/:eventId/stats', controller.contarPorEvent);
  router.get('/:id', controller.obtenerPorId);
  router.post('/:id/cancel', controller.cancelar);

  return router;
};
