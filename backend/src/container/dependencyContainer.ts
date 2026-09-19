import { MongoCompanyRepository } from '../adapters/output/database/repositories/MongoCompanyRepository';
import { MongoUserRepository } from '../adapters/output/database/repositories/MongoUserRepository';
import { MongoEventRepository } from '../adapters/output/database/repositories/MongoEventRepository';
import { MongoTicketTypeRepository } from '../adapters/output/database/repositories/MongoTicketTypeRepository';
import { MongoOrderRepository } from '../adapters/output/database/repositories/MongoOrderRepository';
import { MongoTicketRepository } from '../adapters/output/database/repositories/MongoTicketRepository';
import { QrCodeService } from '../adapters/output/external/QrCodeService';
import { PdfService } from '../adapters/output/external/PdfService';
import { AuthService } from '../domain/services/AuthService';
import { CompanyService } from '../domain/services/CompanyService';
import { EventService } from '../domain/services/EventService';
import { TicketTypeService } from '../domain/services/TicketTypeService';
import { OrderService } from '../domain/services/OrderService';
import { TicketService } from '../domain/services/TicketService';
import { AuthController } from '../adapters/input/rest/AuthController';
import { CompanyController } from '../adapters/input/rest/CompanyController';
import { EventController } from '../adapters/input/rest/EventController';
import { OrderController } from '../adapters/input/rest/OrderController';
import { TicketController } from '../adapters/input/rest/TicketController';

export class Container {
  private static _companyRepository: MongoCompanyRepository;
  private static _userRepository: MongoUserRepository;
  private static _eventRepository: MongoEventRepository;
  private static _ticketTypeRepository: MongoTicketTypeRepository;
  private static _orderRepository: MongoOrderRepository;
  private static _ticketRepository: MongoTicketRepository;
  private static _qrService: QrCodeService;
  private static _pdfService: PdfService;
  private static _authService: AuthService;
  private static _companyService: CompanyService;
  private static _eventService: EventService;
  private static _ticketTypeService: TicketTypeService;
  private static _orderService: OrderService;
  private static _ticketService: TicketService;
  private static _authController: AuthController;
  private static _companyController: CompanyController;
  private static _eventController: EventController;
  private static _orderController: OrderController;
  private static _ticketController: TicketController;

  static get companyRepository(): MongoCompanyRepository {
    if (!this._companyRepository) this._companyRepository = new MongoCompanyRepository();
    return this._companyRepository;
  }

  static get userRepository(): MongoUserRepository {
    if (!this._userRepository) this._userRepository = new MongoUserRepository();
    return this._userRepository;
  }

  static get eventRepository(): MongoEventRepository {
    if (!this._eventRepository) this._eventRepository = new MongoEventRepository();
    return this._eventRepository;
  }

  static get ticketTypeRepository(): MongoTicketTypeRepository {
    if (!this._ticketTypeRepository) this._ticketTypeRepository = new MongoTicketTypeRepository();
    return this._ticketTypeRepository;
  }

  static get orderRepository(): MongoOrderRepository {
    if (!this._orderRepository) this._orderRepository = new MongoOrderRepository();
    return this._orderRepository;
  }

  static get ticketRepository(): MongoTicketRepository {
    if (!this._ticketRepository) this._ticketRepository = new MongoTicketRepository();
    return this._ticketRepository;
  }

  static get qrService(): QrCodeService {
    if (!this._qrService) this._qrService = new QrCodeService();
    return this._qrService;
  }

  static get pdfService(): PdfService {
    if (!this._pdfService) this._pdfService = new PdfService();
    return this._pdfService;
  }

  static get authService(): AuthService {
    if (!this._authService) this._authService = new AuthService(this.userRepository);
    return this._authService;
  }

  static get companyService(): CompanyService {
    if (!this._companyService) {
      this._companyService = new CompanyService(this.companyRepository, this.userRepository);
    }
    return this._companyService;
  }

  static get eventService(): EventService {
    if (!this._eventService) {
      this._eventService = new EventService(
        this.eventRepository,
        this.ticketTypeRepository,
        this.ticketRepository,
        this.orderRepository
      );
    }
    return this._eventService;
  }

  static get ticketTypeService(): TicketTypeService {
    if (!this._ticketTypeService) {
      this._ticketTypeService = new TicketTypeService(this.ticketTypeRepository, this.eventRepository);
    }
    return this._ticketTypeService;
  }

  static get orderService(): OrderService {
    if (!this._orderService) {
      this._orderService = new OrderService(
        this.orderRepository,
        this.eventRepository,
        this.ticketTypeRepository,
        this.ticketRepository,
        this.userRepository,
        this.qrService
      );
    }
    return this._orderService;
  }

  static get ticketService(): TicketService {
    if (!this._ticketService) {
      this._ticketService = new TicketService(
        this.ticketRepository,
        this.eventRepository,
        this.ticketTypeRepository,
        this.companyRepository
      );
    }
    return this._ticketService;
  }

  static get authController(): AuthController {
    if (!this._authController) this._authController = new AuthController(this.authService);
    return this._authController;
  }

  static get companyController(): CompanyController {
    if (!this._companyController) this._companyController = new CompanyController(this.companyService);
    return this._companyController;
  }

  static get eventController(): EventController {
    if (!this._eventController) {
      this._eventController = new EventController(this.eventService, this.ticketTypeService);
    }
    return this._eventController;
  }

  static get orderController(): OrderController {
    if (!this._orderController) this._orderController = new OrderController(this.orderService);
    return this._orderController;
  }

  static get ticketController(): TicketController {
    if (!this._ticketController) {
      this._ticketController = new TicketController(this.ticketService, this.pdfService);
    }
    return this._ticketController;
  }
}
