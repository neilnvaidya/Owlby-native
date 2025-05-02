import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import authRoutes from './routes/auth';
import learningNodesRoutes from './routes/learning-nodes';
import { authMiddleware } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CORS_ORIGIN || 'https://*.vercel.app']
    : [
        'http://localhost:8081',
        'http://localhost:3001',
        'http://10.16.22.25:8081',
        'http://10.16.22.25:3001',
        'exp://10.16.22.25:8081'
      ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/learning-nodes', learningNodesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// Start the server only if not in serverless environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV !== 'production') {
const port = process.env.PORT || 3001;
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export the Express API
export default app; 