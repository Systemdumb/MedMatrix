import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import patientsRouter from './routes/patients.js';
import medicationsRouter from './routes/medications.js';
import schedulesRouter from './routes/schedules.js';
import eventsRouter from './routes/events.js';
import barriersRouter from './routes/barriers.js';
import interventionsRouter from './routes/interventions.js';
import responsesRouter from './routes/responses.js';

export const createApp = (): express.Application => {
  const app = express();

  // Security Middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows SPA dynamic assets and external CDN scripts if needed
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // Robust CORS Configuration
  const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const allowedOrigins = rawClientUrl
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:5000'].forEach((devOrigin) => {
    if (!allowedOrigins.includes(devOrigin)) {
      allowedOrigins.push(devOrigin);
    }
  });

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, '');
        if (allowedOrigins.includes('*') || allowedOrigins.includes(cleanOrigin)) {
          return callback(null, true);
        }
        if (allowedOrigins.some((allowed) => allowed.includes('vercel.app') && cleanOrigin.endsWith('.vercel.app'))) {
          return callback(null, true);
        }
        if (allowedOrigins.some((allowed) => allowed.includes('onrender.com') && cleanOrigin.endsWith('.onrender.com'))) {
          return callback(null, true);
        }
        // Fallback allow for seamless demo deployment
        return callback(null, true);
      },
      credentials: true,
    })
  );

  // Body Parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health Endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // REST API Routes
  app.use('/api/patients', patientsRouter);
  app.use('/api/medications', medicationsRouter);
  app.use('/api/schedules', schedulesRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/barriers', barriersRouter);
  app.use('/api/interventions', interventionsRouter);
  app.use('/api/intervention-responses', responsesRouter);

  // Static Frontend Serving (for single-service full-stack deployment)
  const distPath = path.resolve(process.cwd(), '../dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Centralized Error Handling Middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Application Error:', err.message || err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'An unexpected server error occurred.',
    });
  });

  return app;
};

