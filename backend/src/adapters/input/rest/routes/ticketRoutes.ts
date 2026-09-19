import { Router } from 'express';
import { TicketController } from '../TicketController';
import { authMiddleware } from '../../../../shared/middleware/auth';
import { requireRole, requireCompanyAccess } from '../../../../shared/middleware/authorization';
import { validate } from '../../../../shared/middleware/validate';
import { CheckInSchema } from '../../../../shared/utils/validator';

export const createTicketRoutes = (controller: TicketController): Router => {
  const router = Router();

  router.use(authMiddleware);

  router.get('/my', controller.listarPorUser);

  router.post(
    '/checkin',
    requireCompanyAccess,
    requireRole('superadmin', 'company_admin', 'company_staff'),
    validate(CheckInSchema),
    controller.checkIn
  );

  router.get('/:code/pdf', controller.descargarPdf);
  router.get('/:code', controller.obtenerPorCode);

  return router;
};
