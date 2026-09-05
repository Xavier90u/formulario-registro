import { Request, Response } from 'express';
import { TicketUseCase } from '../../../ports/input/TicketUseCase';
import { TicketSchema, ConsumirTicketSchema } from '../../../shared/utils/validator';
import { CustomError } from '../../../shared/errors/CustomError';

export class TicketController {
  constructor(private readonly ticketUseCase: TicketUseCase) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = TicketSchema.parse(req.body);
      const ticket = await this.ticketUseCase.crearTicket(validatedData);
      res.status(201).json({
        success: true,
        data: ticket,
        message: 'Ticket creado exitosamente',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
    }
  };

  consumir = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = ConsumirTicketSchema.parse(req.body);
      const result = await this.ticketUseCase.consumirTicket(validatedData);

      if (result.yaConsumido) {
        res.status(409).json({
          success: false,
          data: result,
          message: `Este ticket ya fue consumido el ${result.fechaConsumo}`,
        });
        return;
      }

      res.json({
        success: true,
        data: result,
        message: 'Ticket consumido exitosamente',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const ticket = await this.ticketUseCase.obtenerTicketPorId(id);
      res.json({ success: true, data: ticket });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
    }
  };

  obtenerPorDni = async (req: Request, res: Response): Promise<void> => {
    try {
      const { dni } = req.params;
      const ticket = await this.ticketUseCase.obtenerTicketPorDni(dni);
      res.json({ success: true, data: ticket });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tickets = await this.ticketUseCase.listarTodos();
      res.json({ success: true, data: tickets, total: tickets.length });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  };

  estadisticas = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.ticketUseCase.obtenerEstadisticas();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  };
}
