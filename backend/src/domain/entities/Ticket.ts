export interface Ticket {
  id?: string;
  nombre: string;
  apellido: string;
  dni: string;
  facultad: string;
  codigoQR?: string;
  fechaRegistro: Date;
  consumido: boolean;
  fechaConsumo?: Date;
}

export interface CrearTicketDTO {
  nombre: string;
  apellido: string;
  dni: string;
  facultad: string;
}

export interface ConsumirTicketDTO {
  dni: string;
}

export interface TicketConsumidoResponse {
  ticket: Ticket;
  consumido: boolean;
  fechaConsumo?: Date;
  yaConsumido?: boolean;
}

export interface Estadisticas {
  total: number;
  consumidos: number;
  pendientes: number;
  porFacultad: Record<string, number>;
  porDia: Record<string, number>;
}
