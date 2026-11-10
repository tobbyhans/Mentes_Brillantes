export const GAME_CATEGORIES = ['Ciencia','Tecnología','Ingeniería','Arte','Matemáticas'] as const;
export type GameCategory = typeof GAME_CATEGORIES[number];
export type GameStatus = 'available' | 'coming-soon';
export interface Game {
  id: string;
  title: string;
  category: GameCategory;
  icon: string;
  description: string;
  status: GameStatus;
  route: string | null;
  order: number;
}
