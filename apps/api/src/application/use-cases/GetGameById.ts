import type { Game } from '../../domain/entities/Game.js';
import type { GameRepository } from '../../domain/repositories/GameRepository.js';
export class GetGameById {
  constructor(private readonly repository: GameRepository) {}
  execute(id: string): Promise<Game | null> { return this.repository.findById(id); }
}
