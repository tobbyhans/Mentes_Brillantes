import { Router } from 'express';
import type { GamesController } from '../controllers/GamesController.js';
export const gamesRoutes = (controller: GamesController): Router => {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.detail);
  return router;
};
