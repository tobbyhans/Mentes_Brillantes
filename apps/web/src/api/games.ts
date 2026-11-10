export const GAME_CATEGORIES = ['Ciencia', 'Tecnología', 'Ingeniería', 'Arte', 'Matemáticas'] as const;
export type GameCategory = typeof GAME_CATEGORIES[number];
export type Game = {
  id: string; title: string; category: GameCategory; icon: string; description: string;
  status: 'available' | 'coming-soon'; route: string | null; order: number;
};

const slug = /^[a-z0-9](?:[a-z0-9-]{0,63})$/;
const iconName = /^[a-zA-Z][a-zA-Z0-9]{0,63}$/;
const safeRoute = /^\/juegos\/[a-z0-9](?:[a-z0-9-]{0,63})$/;

/** Every field is validated at the network boundary; TypeScript types alone do not validate JSON. */
export function parseGame(value: unknown): Game {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Juego inválido');
  const game = value as Record<string, unknown>;
  if (typeof game.id !== 'string' || !slug.test(game.id) ||
    typeof game.title !== 'string' || !game.title.trim() || game.title.length > 120 ||
    typeof game.description !== 'string' || game.description.length > 600 ||
    typeof game.icon !== 'string' || !iconName.test(game.icon) ||
    !GAME_CATEGORIES.includes(game.category as GameCategory) ||
    (game.status !== 'available' && game.status !== 'coming-soon') ||
    (game.route !== null && (typeof game.route !== 'string' || !safeRoute.test(game.route))) ||
    (game.status === 'available' && game.route === null) ||
    typeof game.order !== 'number' || !Number.isInteger(game.order) || game.order < 0 || game.order > 10000) {
    throw new Error('Juego inválido');
  }
  return {id:game.id, title:game.title, category:game.category as GameCategory,
    icon:game.icon, description:game.description, status:game.status,
    route:game.route as string | null, order:game.order};
}

export function parseGamesResponse(value: unknown): Game[] {
  if (!value || typeof value !== 'object' || !('data' in value) || !Array.isArray(value.data)) {
    throw new Error('Respuesta inválida del servidor');
  }
  const games = value.data.map(parseGame);
  if (new Set(games.map(g => g.id)).size !== games.length) throw new Error('IDs duplicados');
  return games;
}

export async function getGames(signal?: AbortSignal): Promise<Game[]> {
  const response = await fetch('/api/games', {signal});
  if (!response.ok) throw new Error(`Error de catálogo: HTTP ${response.status}`);
  return parseGamesResponse(await response.json() as unknown);
}

export async function getGameById(id: string): Promise<Game | null> {
  if (!slug.test(id)) throw new Error('ID de juego no válido');
  const response = await fetch(`/api/games/${encodeURIComponent(id)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('data' in data)) throw new Error('Respuesta inválida del servidor');
  return parseGame(data.data);
}
