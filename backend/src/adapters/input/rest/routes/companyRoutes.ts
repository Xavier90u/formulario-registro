import { Router } from 'express';
import { CompanyController } from '../CompanyController';
import { authMiddleware } from '../../../../shared/middleware/auth';
import { requireRole } from '../../../../shared/middleware/authorization';
import { validate } from '../../../../shared/middleware/validate';
import { CompanySchema, UpdateCompanySchema, UpdateCompanyStatusSchema } from '../../../../shared/utils/validator';

export const createCompanyRoutes = (controller: CompanyController): Router => {
  const router = Router();

  router.use(authMiddleware);
  router.use(requireRole('superadmin'));

  router.post('/', validate(CompanySchema), controller.crear);
  router.get('/', controller.listar);
  router.get('/:id', controller.obtenerPorId);
  router.put('/:id', validate(UpdateCompanySchema), controller.actualizar);
  router.put('/:id/status', validate(UpdateCompanyStatusSchema), controller.cambiarEstado);

  return router;
};
