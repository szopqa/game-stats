import { Test, TestingModule } from '@nestjs/testing';
import { GameStatsService } from './game-stats.service';
import { GameStatsRepository } from './game-stats-repositories/game-stats-repository.interface';
import { GAME_STATS_PROVIDER, GameStats, PlayerStats, STAT_TYPE, TeamStats } from 'types';

import { faker } from '@faker-js/faker';
import { MockedGameStatsInMemoryRepository } from './game-stats-repositories/mocked-game-stats-in-memory.repository';

const MOCKED_GAME_ID = faker.string.uuid();

const MOCKED_STATS_FOR_GAME: GameStats[] = [
  {
    gameId: MOCKED_GAME_ID,
    sourceId: GAME_STATS_PROVIDER.SPORT_RADAR,
    statType: STAT_TYPE.GAME,
    awayTeamId: 'ba27615c-07df-41f0-864b-332575f744f2',
    homeTeamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
    stats: {
      attendance: 62487,
    },
  },
  {
    gameId: MOCKED_GAME_ID,
    awayTeamId: 'ba27615c-07df-41f0-864b-332575f744f2',
    homeTeamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
    sourceId: GAME_STATS_PROVIDER.EXTERNAL_A,
    statType: STAT_TYPE.GAME,
    stats: {
      attendance: 33876,
    },
  },
];

const MOCKED_STATS_FOR_TEAM: TeamStats[] = [
  {
    gameId: MOCKED_GAME_ID,
    sourceId: GAME_STATS_PROVIDER.EXTERNAL_A,
    statType: STAT_TYPE.TEAM,
    teamId: 'ba27615c-07df-41f0-864b-332575f744f2',
    stats: {
      receivingReceptions: 27,
      receivingYards: 239,
      rushTouchdowns: 1,
      rushYards: 97,
      rushAttempts: 37,
    },
  },
  {
    gameId: MOCKED_GAME_ID,
    sourceId: GAME_STATS_PROVIDER.SPORT_RADAR,
    statType: STAT_TYPE.TEAM,
    teamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
    stats: {
      receivingReceptions: 31,
      receivingYards: 257,
      rushTouchdowns: 0,
      rushYards: 78,
      rushAttempts: 39,
    },
  },
];

const MOCKED_STATS_FOR_PLAYER: PlayerStats[] = [
  {
    gameId: MOCKED_GAME_ID,
    teamId: 'ba27615c-07df-41f0-864b-332575f744f2',
    sourceId: GAME_STATS_PROVIDER.EXTERNAL_A,
    statType: STAT_TYPE.PLAYER,
    playerId: 'e11a2815-8f31-44b0-8c37-64240bcbc059',
    stats: {
      receivingReceptions: null,
      receivingYards: null,
      rushAttempts: 14,
      rushTouchdowns: 2,
      rushYards: 73,
    },
  },
  {
    gameId: MOCKED_GAME_ID,
    teamId: 'ba27615c-07df-41f0-864b-332575f744f2',
    sourceId: GAME_STATS_PROVIDER.EXTERNAL_A,
    statType: STAT_TYPE.PLAYER,
    playerId: 'f94fb8a3-cd77-4064-bc65-447550b43622',
    stats: {
      receivingReceptions: 9,
      receivingYards: 47,
      rushAttempts: null,
      rushTouchdowns: null,
      rushYards: null,
    },
  },
  {
    gameId: MOCKED_GAME_ID,
    teamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
    sourceId: GAME_STATS_PROVIDER.SPORT_RADAR,
    statType: STAT_TYPE.PLAYER,
    playerId: 'e5b67a2e-e0f7-4646-a343-c9bd0ae447f0',
    stats: {
      receivingReceptions: 1,
      receivingYards: 4,
      rushAttempts: 10,
      rushTouchdowns: 0,
      rushYards: -4,
    },
  },
];

describe('GameStatsService', () => {
  let service: GameStatsService;
  const mockedGameStatsInMemoryRepository = new MockedGameStatsInMemoryRepository();
  mockedGameStatsInMemoryRepository.seed([
    ...MOCKED_STATS_FOR_GAME,
    ...MOCKED_STATS_FOR_TEAM,
    ...MOCKED_STATS_FOR_PLAYER,
  ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameStatsService,
        { provide: GameStatsRepository, useValue: mockedGameStatsInMemoryRepository },
      ],
    }).compile();

    service = module.get<GameStatsService>(GameStatsService);
  });

  it('getStats should provide stats for given stat type', async () => {
    // given
    const STAT_TYPES = [STAT_TYPE.GAME, STAT_TYPE.TEAM, STAT_TYPE.PLAYER];

    // when
    for (const statType of STAT_TYPES) {
      const stats = await service.getStats(statType, { gameId: MOCKED_GAME_ID });

      // then
      expect(stats.every(stat => stat.statType === statType)).toBe(true);
      expect(stats.every(stat => stat.gameId === MOCKED_GAME_ID)).toBe(true);
    }
  });

  it('getAllStats should provide all stats for given game', async () => {
    // given
    const query = { gameId: MOCKED_GAME_ID };

    // when
    const stats = await service.getAllStats(query);

    // then
    expect(stats.some(stat => stat.statType === STAT_TYPE.GAME)).toBe(true);
    expect(stats.some(stat => stat.statType === STAT_TYPE.TEAM)).toBe(true);
    expect(stats.some(stat => stat.statType === STAT_TYPE.PLAYER)).toBe(true);

    expect(stats.every(stat => stat.gameId === MOCKED_GAME_ID)).toBe(true);
  });

  it('should throw error when unable to find stats for provided game id', async () => {
    // given
    const query = { gameId: 'NON_EXISTING_GAME_ID' };
    const STAT_TYPES = [STAT_TYPE.GAME, STAT_TYPE.TEAM, STAT_TYPE.PLAYER];

    for (const statType of STAT_TYPES) {
      // when
      const functionUnderTest = async () => {
        await service.getStats(statType, query);
      };

      //then
      await expect(await functionUnderTest).rejects.toThrow(
        `Unable to find stats of type ${statType} for game with id ${query.gameId}`,
      );
    }
  });
});
