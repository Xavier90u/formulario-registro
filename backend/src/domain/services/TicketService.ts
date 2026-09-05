import { CrearTicketDTO, ConsumirTicketDTO, Ticket, TicketConsumidoResponse, Estadisticas } from '../entities/Ticket';
import { TicketUseCase } from '../../ports/input/TicketUseCase';
import { TicketRepository } from '../../ports/output/TicketRepository';
import { QrCodePort } from '../../ports/output/QrCodePort';
import { CustomError } from '../../shared/errors/CustomError';

export class TicketService implements TicketUseCase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly qrService: QrCodePort
  ) {}

  async crearTicket(data: CrearTicketDTO): Promise<Ticket> {
    const existente = await this.ticketRepository.obtenerPorDni(data.dni);
    if (existente) {
      throw new CustomError('El DNI ya se encuentra registrado', 400);
    }

    const ticket: Ticket = {
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      facultad: data.facultad,
      fechaRegistro: new Date(),
      consumido: false,
    };

    const ticketGuardado = await this.ticketRepository.crear(ticket);

    const qrData = JSON.stringify({
      id: ticketGuardado.id,
      nombre: ticketGuardado.nombre,
      dni: ticketGuardado.dni,
    });
    const codigoQR = await this.qrService.generarQR(qrData);

    const ticketActualizado = await this.ticketRepository.actualizar(
      ticketGuardado.id!,
      { codigoQR }
    );

    return ticketActualizado;
  }

  async consumirTicket(data: ConsumirTicketDTO): Promise<TicketConsumidoResponse> {
    const ticket = await this.ticketRepository.obtenerPorDni(data.dni);
    if (!ticket) {
      throw new CustomError('Ticket no encontrado para ese DNI', 404);
    }

    if (ticket.consumido) {
      return {
        ticket,
        consumido: true,
        fechaConsumo: ticket.fechaConsumo,
        yaConsumido: true,
      };
    }

    const ticketActualizado = await this.ticketRepository.actualizar(ticket.id!, {
      consumido: true,
      fechaConsumo: new Date(),
    });

    return {
      ticket: ticketActualizado,
      consumido: true,
      fechaConsumo: ticketActualizado.fechaConsumo,
      yaConsumido: false,
    };
  }

  async obtenerTicketPorId(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.obtenerPorId(id);
    if (!ticket) {
      throw new CustomError('Ticket no encontrado', 404);
    }
    return ticket;
  }

  async obtenerTicketPorDni(dni: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.obtenerPorDni(dni);
    if (!ticket) {
      throw new CustomError('Ticket no encontrado para ese DNI', 404);
    }
    return ticket;
  }

  async listarTodos(): Promise<Ticket[]> {
    return this.ticketRepository.listar();
  }

  async obtenerEstadisticas(): Promise<Estadisticas> {
    const tickets = await this.ticketRepository.listar();
    const porFacultad = await this.ticketRepository.contarPorFacultad();
    const porDia = await this.ticketRepository.contarPorDia();
    const consumidos = await this.ticketRepository.contarConsumidos();

    return {
      total: tickets.length,
      consumidos,
      pendientes: tickets.length - consumidos,
      porFacultad,
      porDia,
    };
  }
}
