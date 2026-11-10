import type { Request, Response, NextFunction } from 'express';
import { GAME_CATEGORIES } from '../../domain/entities/Game.js';
import type { GameCategory } from '../../domain/entities/Game.js';
import type { GetGames } from '../../application/use-cases/GetGames.js';
import type { GetGameById } from '../../application/use-cases/GetGameById.js';
export class GamesController {
  constructor(private readonly getGames: GetGames, private readonly getGameById: GetGameById) {}
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryParam = req.query.category;
      if (categoryParam !== undefined && (typeof categoryParam !== 'string' || !GAME_CATEGORIES.includes(categoryParam as GameCategory))) {
        res.status(400).json({ error: 'Categoría no válida' }); return;
      }
      const data = await this.getGames.execute(categoryParam as GameCategory | undefined);
      res.json({ data, count: data.length });
    } catch (error) { next(error); }
  };
  detail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      if (typeof id !== 'string' || !/^[a-z0-9](?:[a-z0-9-]{0,63})$/.test(id)) { res.status(400).json({ error: 'ID de juego no válido' }); return; }
      const game = await this.getGameById.execute(id);
      if (!game) { res.status(404).json({ error: 'Juego no encontrado' }); return; }
      res.json({ data: game });
    } catch (error) { next(error); }
  };
}
