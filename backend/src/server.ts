import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { Container } from './container/dependencyContainer';
import { createTicketRoutes } from './adapters/input/rest/routes/ticketRoutes';
import { createAuthRoutes } from './adapters/input/rest/routes/authRoutes';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/tickets', createTicketRoutes(Container.ticketController));
app.use('/api/auth', createAuthRoutes(Container.authController));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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
