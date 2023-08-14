import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { GAME_STATS_PROVIDER } from 'types';
import { StatsProviderFactory } from './stats-provider.factory';
import {
  GameStatsRepository,
  IGameStatsRepository,
} from '../game-stats/game-stats-repositories/game-stats-repository.interface';
import { GameStatsProviders, GamesIdentifiers } from './game-stats-sync.config';

@Injectable()
export class GameStatsSyncService implements OnModuleInit {
  constructor(
    @Inject(GameStatsRepository) private readonly gameStatsRepository: IGameStatsRepository,
    @Inject(GameStatsProviders) private readonly GAME_STATS_PROVIDERS: GAME_STATS_PROVIDER[],
    @Inject(GamesIdentifiers) private readonly GAMES_IDENTIFIERS: string[],
    private readonly statsProviderFactory: StatsProviderFactory,
  ) {}

  async syncAndStoreGameStatsFromProvider(gameStatsProvider: GAME_STATS_PROVIDER): Promise<void> {
    const provider = this.statsProviderFactory.createProvider(gameStatsProvider);
    const allGamesStats = await Promise.all(
      this.GAMES_IDENTIFIERS.map(gameId => provider.getStatsForGame(gameId)),
    );
    const mappedStats = allGamesStats.flatMap(stat => provider.getAllStatsFromGame(stat));

    await Promise.all(mappedStats.map(stat => this.gameStatsRepository.saveNewGameStatistic(stat)));
  }

  async onModuleInit() {
    await Promise.all(
      this.GAME_STATS_PROVIDERS.map(this.syncAndStoreGameStatsFromProvider.bind(this)),
    );
  }
}
