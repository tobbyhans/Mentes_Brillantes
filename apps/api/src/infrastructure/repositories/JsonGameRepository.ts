import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Game } from '../../domain/entities/Game.js';
import { GAME_CATEGORIES } from '../../domain/entities/Game.js';
import type { GameRepository } from '../../domain/repositories/GameRepository.js';

const SLUG = /^[a-z0-9](?:[a-z0-9-]{0,63})$/;
const ICON = /^[a-zA-Z][a-zA-Z0-9]{0,63}$/;
const INTERNAL_ROUTE = /^\/juegos\/[a-z0-9](?:[a-z0-9-]{0,63})$/;

/** Validate the whole catalog before exposing it through the API. */
export const isGame = (data: unknown): data is Game => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const g = data as Record<string, unknown>;
  return typeof g.id === 'string' && SLUG.test(g.id)
    && typeof g.title === 'string' && !!g.title.trim() && g.title.length <= 120
    && typeof g.description === 'string' && g.description.length <= 600
    && typeof g.icon === 'string' && ICON.test(g.icon)
    && GAME_CATEGORIES.includes(g.category as Game['category'])
    && (g.status === 'available' || g.status === 'coming-soon')
    && (g.route === null || (typeof g.route === 'string' && INTERNAL_ROUTE.test(g.route)))
    && (g.status !== 'available' || g.route !== null)
    && typeof g.order === 'number' && Number.isInteger(g.order) && g.order >= 0 && g.order <= 10000;
};

export class JsonGameRepository implements GameRepository {
  constructor(private readonly filePath: string = fileURLToPath(new URL('../../../data/games.json', import.meta.url))) {}
  async findAll(): Promise<Game[]> {
    const parsed: unknown = JSON.parse(await readFile(this.filePath, 'utf8'));
    if (!Array.isArray(parsed) || !parsed.every(isGame) ||
        new Set((parsed as Game[]).map(game => game.id)).size !== parsed.length) {
      throw new Error('Catálogo JSON inválido');
    }
    return parsed as Game[];
  }
  async findById(id: string): Promise<Game | null> {
    return (await this.findAll()).find(game => game.id === id) ?? null;
  }
}
