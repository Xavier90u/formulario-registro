import { Router } from 'express';
import { TicketController } from '../TicketController';

export const createTicketRoutes = (controller: TicketController): Router => {
  const router = Router();

  router.post('/', controller.crear);
  router.post('/consume', controller.consumir);
  router.get('/', controller.listar);
  router.get('/stats', controller.estadisticas);
  router.get('/:id', controller.obtenerPorId);
  router.get('/dni/:dni', controller.obtenerPorDni);

  return router;
};
