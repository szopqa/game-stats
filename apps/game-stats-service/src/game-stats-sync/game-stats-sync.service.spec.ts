import { Test, TestingModule } from '@nestjs/testing';
import { GameStatsSyncService } from './game-stats-sync.service';
import { GameStatsRepository } from '../game-stats/game-stats-repositories/game-stats-repository.interface';
import { GameStatsProviders, GamesIdentifiers } from './game-stats-sync.config';
import { GAME_STATS_PROVIDER } from 'types';
import { faker } from '@faker-js/faker';
import { StatsProviderFactory } from './stats-provider.factory';

describe('GameStatsSyncService', () => {
  let service: GameStatsSyncService;

  const MOCKED_MAPPED_STATS = [
    {
      gameId: '15adf794-5630-4dc4-b0e7-f8d437b585b1',
      teamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
      sourceId: 'external',
      statType: 'PLAYER',
      playerId: 'e5b67a2e-e0f7-4646-a343-c9bd0ae447f0',
      stats: {
        receivingReceptions: 1,
        receivingYards: 4,
        rushAttempts: 10,
        rushTouchdowns: 0,
        rushYards: -4,
      },
    },
    {
      gameId: '15adf794-5630-4dc4-b0e7-f8d437b585b1',
      teamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
      sourceId: 'external',
      statType: 'PLAYER',
      playerId: 'c90711f2-5c4e-4f2e-8635-0d3f2336f581',
      stats: {
        receivingReceptions: null,
        receivingYards: null,
        rushAttempts: 2,
        rushTouchdowns: 0,
        rushYards: -15,
      },
    },
    {
      gameId: '15adf794-5630-4dc4-b0e7-f8d437b585b1',
      teamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
      sourceId: 'external',
      statType: 'PLAYER',
      playerId: '713daff7-86cc-4283-91a8-1579c3f58f59',
      stats: {
        receivingReceptions: 8,
        receivingYards: 92,
        rushAttempts: null,
        rushTouchdowns: null,
        rushYards: null,
      },
    },
  ];

  const mockGameStatsRepository = {
    saveNewGameStatistic: jest.fn(),
  };

  const mockStatsProviderFactory = {
    createProvider: jest.fn(() => ({
      getStatsForGame: jest.fn(() => Promise.resolve([])),
      getAllStatsFromGame: jest.fn(() => MOCKED_MAPPED_STATS),
    })),
  };

  const GAME_STATS_PROVIDERS = [GAME_STATS_PROVIDER.SPORT_RADAR, GAME_STATS_PROVIDER.EXTERNAL_A];
  const GAMES_IDENTIFIERS = [faker.string.uuid()];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameStatsSyncService,
        { provide: GameStatsRepository, useValue: mockGameStatsRepository },
        { provide: GameStatsProviders, useValue: GAME_STATS_PROVIDERS },
        { provide: GamesIdentifiers, useValue: GAMES_IDENTIFIERS },
        { provide: StatsProviderFactory, useValue: mockStatsProviderFactory },
      ],
    }).compile();

    service = module.get<GameStatsSyncService>(GameStatsSyncService);
  });

  afterEach(() => {
    mockGameStatsRepository.saveNewGameStatistic.mockClear();
  });

  it('should process game stats for each configured provider', async () => {
    // given
    const syncAndStoreGameStatsFromProviderSpy = jest.spyOn(
      service,
      'syncAndStoreGameStatsFromProvider',
    );

    // when
    await service.onModuleInit();

    // then
    expect(syncAndStoreGameStatsFromProviderSpy).toHaveBeenCalledTimes(GAME_STATS_PROVIDERS.length);
  });

  it('should sync and store game stats for each configured provider', async () => {
    // given
    const syncAndStoreGameStatsFromProviderSpy = jest.spyOn(
      service,
      'syncAndStoreGameStatsFromProvider',
    );

    const saveNewGameStatisticSpy = jest.spyOn(mockGameStatsRepository, 'saveNewGameStatistic');

    // when
    await service.onModuleInit();

    // then
    expect(syncAndStoreGameStatsFromProviderSpy).toHaveBeenCalledTimes(GAME_STATS_PROVIDERS.length);
    expect(saveNewGameStatisticSpy).toHaveBeenCalledTimes(
      MOCKED_MAPPED_STATS.length * GAME_STATS_PROVIDERS.length,
    );
    MOCKED_MAPPED_STATS.forEach(mockedStats => {
      expect(saveNewGameStatisticSpy).toBeCalledWith(mockedStats);
    });
  });
});
