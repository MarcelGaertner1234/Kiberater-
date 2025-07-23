import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './api/auth';
import userRoutes from './api/users';
import projectRoutes from './api/projects';
import assessmentRoutes from './api/assessments';
import contentRoutes from './api/content';
import analyticsRoutes from './api/analytics';

// Import utils
import { logger } from './utils/logger';
import { prisma } from './utils/prisma';

// Create Express app
const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Basic middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Rate limiting
app.use('/api', rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`New socket connection: ${socket.id}`);

  socket.on('join_project', (projectId: string) => {
    socket.join(`project_${projectId}`);
    logger.info(`Socket ${socket.id} joined project ${projectId}`);
  });

  socket.on('leave_project', (projectId: string) => {
    socket.leave(`project_${projectId}`);
    logger.info(`Socket ${socket.id} left project ${projectId}`);
  });

  socket.on('send_message', async (data) => {
    // Handle real-time messaging
    io.to(`project_${data.projectId}`).emit('new_message', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    process.exit(0);
  });
});

export { app, io };