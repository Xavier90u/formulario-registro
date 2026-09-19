import { Request, Response } from 'express';
import { EventUseCase } from '../../../ports/input/EventUseCase';
import { TicketTypeUseCase } from '../../../ports/input/TicketTypeUseCase';
import { sendSuccess, asyncHandler } from './helpers';

export class EventController {
  constructor(
    private readonly eventUseCase: EventUseCase,
    private readonly ticketTypeUseCase: TicketTypeUseCase
  ) {}

  crear = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const event = await this.eventUseCase.crear(req.user!.companyId!, req.body);
    sendSuccess(res, event, 'Evento creado exitosamente', 201);
  });

  listarPorCompany = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const events = await this.eventUseCase.listarPorCompany(req.user!.companyId!, req.query.status as any);
    sendSuccess(res, events);
  });

  obtenerPorId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const event = await this.eventUseCase.obtenerPorId(req.params.id);
    sendSuccess(res, event);
  });

  actualizar = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const event = await this.eventUseCase.actualizar(
      req.params.id,
      req.user!.companyId!,
      req.body
    );
    sendSuccess(res, event, 'Evento actualizado exitosamente');
  });

  cambiarEstado = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const event = await this.eventUseCase.cambiarEstado(
      req.params.id,
      req.user!.companyId!,
      req.body.status
    );
    sendSuccess(res, event, 'Estado del evento actualizado');
  });

  dashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.eventUseCase.obtenerDashboard(req.user!.companyId!);
    sendSuccess(res, stats);
  });

  listarPublicados = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const events = await this.eventUseCase.listarPublicados({
      search: req.query.search as string,
      date: req.query.date as string,
    });
    sendSuccess(res, events);
  });

  obtenerPorSlugPublico = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const events = await this.eventUseCase.listarPublicados({});
    const event = events.find((e) => e.slug === req.params.slug);
    if (!event) {
      res.status(404).json({ success: false, message: 'Evento no encontrado' });
      return;
    }
    sendSuccess(res, event);
  });

  crearTicketType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const ticketType = await this.ticketTypeUseCase.crear(
      req.params.id,
      req.user!.companyId!,
      req.body
    );
    sendSuccess(res, ticketType, 'Tipo de entrada creado exitosamente', 201);
  });

  listarTicketTypes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.id || req.params.eventId;
    const ticketTypes = await this.ticketTypeUseCase.listarPorEvent(eventId);
    sendSuccess(res, ticketTypes);
  });
}
