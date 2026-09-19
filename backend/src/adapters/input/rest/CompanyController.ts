import { Request, Response } from 'express';
import { CompanyUseCase } from '../../../ports/input/CompanyUseCase';
import { sendSuccess, asyncHandler } from './helpers';

export class CompanyController {
  constructor(private readonly companyUseCase: CompanyUseCase) {}

  crear = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const company = await this.companyUseCase.crear(req.body);
    sendSuccess(res, company, 'Empresa creada exitosamente', 201);
  });

  listar = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const companies = await this.companyUseCase.listar();
    sendSuccess(res, companies);
  });

  obtenerPorId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const company = await this.companyUseCase.obtenerPorId(req.params.id);
    sendSuccess(res, company);
  });

  actualizar = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const company = await this.companyUseCase.actualizar(req.params.id, req.body);
    sendSuccess(res, company, 'Empresa actualizada exitosamente');
  });

  cambiarEstado = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const company = await this.companyUseCase.cambiarEstado(req.params.id, req.body.status);
    sendSuccess(res, company, 'Estado de empresa actualizado');
  });
}
