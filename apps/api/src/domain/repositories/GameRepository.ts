import type { Game } from '../entities/Game.js';
export interface GameRepository {
  findAll(): Promise<Game[]>;
  findById(id: string): Promise<Game | null>;
}
