import express, { type ErrorRequestHandler } from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { GetGames } from './application/use-cases/GetGames.js';
import { GetGameById } from './application/use-cases/GetGameById.js';
import { JsonGameRepository } from './infrastructure/repositories/JsonGameRepository.js';
import type { GameRepository } from './domain/repositories/GameRepository.js';
import { GamesController } from './presentation/controllers/GamesController.js';
import { gamesRoutes } from './presentation/routes/gamesRoutes.js';

export const createApp = (repository: GameRepository = new JsonGameRepository(), options: { serveStatic?: boolean } = {}) => {
  const app = express();
  app.disable('x-powered-by');
  // Defense in depth for SPA and public read-only API. Inline styles are needed by
  // the existing React animations; inline scripts and eval remain forbidden.
  app.use((_req, res, next) => {
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'", "base-uri 'self'", "object-src 'none'",
      "frame-ancestors 'none'", "form-action 'self'", "script-src 'self'",
      "style-src 'self' 'unsafe-inline'", "img-src 'self' data:",
      "font-src 'self'", "connect-src 'self'", "media-src 'self'",
    ].join('; '));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    next();
  });
  app.use('/api', (_req, res, next) => {res.setHeader('Cache-Control', 'no-store'); next();});
  app.get('/api/health', (_req,res) => res.json({ status: 'ok' }));
  const controller = new GamesController(new GetGames(repository), new GetGameById(repository));
  app.use('/api/games', gamesRoutes(controller));
  // En producción sirve la SPA de React; en desarrollo usa Vite (puerto 5173).
  if (options.serveStatic !== false) {
    const webDist = fileURLToPath(new URL('../../web/dist/', import.meta.url));
    if (existsSync(webDist)) {
    app.use(express.static(webDist));
    app.get('*', (req,res,next) => {
      if (req.path === '/api' || req.path.startsWith('/api/')) return next();
      res.sendFile(resolve(webDist,'index.html'));
    });
  }
  }
  app.use('/api', (_req,res) => res.status(404).json({ error: 'Endpoint no encontrado' }));
  const handleError: ErrorRequestHandler = (error, _req, res, next) => {
    if (res.headersSent) { next(error); return; }
    console.error('[API] Fallo en solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  };
  app.use(handleError);
  return app;
};
