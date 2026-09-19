import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { Container } from './container/dependencyContainer';
import { createAuthRoutes } from './adapters/input/rest/routes/authRoutes';
import { createCompanyRoutes } from './adapters/input/rest/routes/companyRoutes';
import { createEventRoutes } from './adapters/input/rest/routes/eventRoutes';
import { createOrderRoutes } from './adapters/input/rest/routes/orderRoutes';
import { createTicketRoutes } from './adapters/input/rest/routes/ticketRoutes';
import { errorHandler } from './shared/middleware/errorHandler';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', createAuthRoutes(Container.authController));
app.use('/api/companies', createCompanyRoutes(Container.companyController));
app.use('/api/events', createEventRoutes(Container.eventController));
app.use('/api/orders', createOrderRoutes(Container.orderController));
app.use('/api/tickets', createTicketRoutes(Container.ticketController));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`Servidor corriendo en puerto ${config.port}`);
      console.log(`Entorno: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
