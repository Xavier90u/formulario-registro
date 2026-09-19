import { Request, Response } from 'express';
import { TicketUseCase } from '../../../ports/input/TicketUseCase';
import { PdfPort } from '../../../ports/output/PdfPort';
import { sendSuccess, asyncHandler } from './helpers';

export class TicketController {
  constructor(
    private readonly ticketUseCase: TicketUseCase,
    private readonly pdfService: PdfPort
  ) {}

  listarPorUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const tickets = await this.ticketUseCase.listarPorUser(req.user!.id);
    sendSuccess(res, tickets);
  });

  obtenerPorCode = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const ticket = await this.ticketUseCase.obtenerPorCode(req.params.code);
    sendSuccess(res, ticket);
  });

  descargarPdf = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pdfData = await this.ticketUseCase.obtenerPdfData(req.params.code);
    const pdfBuffer = await this.pdfService.generarTicketPdf(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=entrada-${req.params.code.slice(0, 8)}.pdf`);
    res.send(pdfBuffer);
  });

  checkIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const ticket = await this.ticketUseCase.checkIn(
      req.body.code,
      req.user!.id,
      req.user!.companyId!
    );
    sendSuccess(res, ticket, 'Check-in realizado exitosamente');
  });
}
