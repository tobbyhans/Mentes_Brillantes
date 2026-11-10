// Cloudflare Workers entry point. The existing Node.js server remains in src/server.ts.
import { httpServerHandler } from 'cloudflare:node';
import catalogJson from './data/games.json' with { type: 'json' };
import { createApp } from './src/app.ts';
import { isGame } from './src/infrastructure/repositories/JsonGameRepository.ts';
import type { Game } from './src/domain/entities/Game.ts';
import type { GameRepository } from './src/domain/repositories/GameRepository.ts';

// Workers do not use the local file system like Node.js. Bundle the catalog
// at build time, retaining the same validation as JsonGameRepository.
const rawCatalog: unknown = catalogJson;
if (!Array.isArray(rawCatalog) || !rawCatalog.every(isGame) ||
    new Set((rawCatalog as Game[]).map((game) => game.id)).size !== rawCatalog.length) {
  throw new Error('Catálogo JSON inválido');
}
const games: Game[] = rawCatalog;

const repository: GameRepository = {
  findAll: async () => games,
  findById: async (id) => games.find((game) => game.id === id) ?? null,
};

// Cloudflare serves the React build through Workers Static Assets instead of
// Express's node:fs-based static middleware; the Express /api routes are shared.
createApp(repository, { serveStatic: false }).listen(3000);
export default httpServerHandler({ port: 3000 });
