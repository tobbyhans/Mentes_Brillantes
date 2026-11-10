import type { Game, GameCategory } from '../../domain/entities/Game.js';
import type { GameRepository } from '../../domain/repositories/GameRepository.js';
export class GetGames {
  constructor(private readonly repository: GameRepository) {}
  async execute(category?: GameCategory): Promise<Game[]> {
    const games = await this.repository.findAll();
    return games.filter(game => !category || game.category === category).sort((a,b) => a.order - b.order);
  }
}
