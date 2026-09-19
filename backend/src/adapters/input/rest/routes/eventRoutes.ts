import { Router } from 'express';
import { EventController } from '../EventController';
import { authMiddleware } from '../../../../shared/middleware/auth';
import { requireRole, requireCompanyAccess } from '../../../../shared/middleware/authorization';
import { validate } from '../../../../shared/middleware/validate';
import {
  EventSchema,
  UpdateEventSchema,
  TicketTypeSchema,
  EventStatusSchema,
} from '../../../../shared/utils/validator';

export const createEventRoutes = (controller: EventController): Router => {
  const router = Router();

  router.get('/public', controller.listarPublicados);
  router.get('/public/:slug', controller.obtenerPorSlugPublico);
  router.get('/:eventId/ticket-types', controller.listarTicketTypes);

  router.use(authMiddleware);
  router.use(requireCompanyAccess);
  router.use(requireRole('superadmin', 'company_admin', 'company_staff'));

  router.get('/dashboard', controller.dashboard);
  router.get('/', controller.listarPorCompany);
  router.post('/', validate(EventSchema), controller.crear);
  router.put('/:id', validate(UpdateEventSchema), controller.actualizar);
  router.put('/:id/status', validate(EventStatusSchema), controller.cambiarEstado);
  router.post('/:id/ticket-types', validate(TicketTypeSchema), controller.crearTicketType);
  router.get('/:id', controller.obtenerPorId);

  return router;
};
