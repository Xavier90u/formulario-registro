import { Request, Response } from 'express';
import { OrderUseCase } from '../../../ports/input/OrderUseCase';
import { sendSuccess, asyncHandler } from './helpers';

export class OrderController {
  constructor(private readonly orderUseCase: OrderUseCase) {}

  crear = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.orderUseCase.crear(req.user!.id, req.body);
    sendSuccess(res, result, 'Compra realizada exitosamente', 201);
  });

  listarPorUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const orders = await this.orderUseCase.listarPorUser(req.user!.id);
    sendSuccess(res, orders);
  });

  obtenerPorId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.orderUseCase.obtenerPorId(req.params.id, req.user!.id);
    sendSuccess(res, result);
  });

  listarPorEvent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const orders = await this.orderUseCase.listarPorEvent(
      req.params.eventId,
      req.user!.companyId!
    );
    sendSuccess(res, orders);
  });

  contarPorEvent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.orderUseCase.contarPorEvent(
      req.params.eventId,
      req.user!.companyId!
    );
    sendSuccess(res, stats);
  });

  cancelar = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const order = await this.orderUseCase.cancelar(req.params.id, req.user!.id);
    sendSuccess(res, order, 'Orden cancelada exitosamente');
  });
}
