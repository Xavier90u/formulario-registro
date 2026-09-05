import { MongoTicketRepository } from '../adapters/output/database/MongoTicketRepository';
import { MongoUserRepository } from '../adapters/output/database/MongoUserRepository';
import { QrCodeService } from '../adapters/output/external/QrCodeService';
import { TicketService } from '../domain/services/TicketService';
import { AuthService } from '../domain/services/AuthService';
import { TicketController } from '../adapters/input/rest/TicketController';
import { AuthController } from '../adapters/input/rest/AuthController';

export class Container {
  private static _ticketRepository: MongoTicketRepository;
  private static _userRepository: MongoUserRepository;
  private static _qrService: QrCodeService;
  private static _ticketService: TicketService;
  private static _authService: AuthService;
  private static _ticketController: TicketController;
  private static _authController: AuthController;

  static get ticketRepository(): MongoTicketRepository {
    if (!this._ticketRepository) {
      this._ticketRepository = new MongoTicketRepository();
    }
    return this._ticketRepository;
  }

  static get userRepository(): MongoUserRepository {
    if (!this._userRepository) {
      this._userRepository = new MongoUserRepository();
    }
    return this._userRepository;
  }

  static get qrService(): QrCodeService {
    if (!this._qrService) {
      this._qrService = new QrCodeService();
    }
    return this._qrService;
  }

  static get ticketService(): TicketService {
    if (!this._ticketService) {
      this._ticketService = new TicketService(this.ticketRepository, this.qrService);
    }
    return this._ticketService;
  }

  static get authService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService(this.userRepository);
    }
    return this._authService;
  }

  static get ticketController(): TicketController {
    if (!this._ticketController) {
      this._ticketController = new TicketController(this.ticketService);
    }
    return this._ticketController;
  }

  static get authController(): AuthController {
    if (!this._authController) {
      this._authController = new AuthController(this.authService);
    }
    return this._authController;
  }
}
