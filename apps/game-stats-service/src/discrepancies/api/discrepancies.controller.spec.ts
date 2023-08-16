import { Test, TestingModule } from '@nestjs/testing';
import { DiscrepanciesController } from './discrepancies.controller';

import { faker } from '@faker-js/faker';
import { MockedGameStatsInMemoryRepository } from '../../game-stats/game-stats-repositories/mocked-game-stats-in-memory.repository';
import {
  DISCREPANCIES_TYPE,
  GAME_STATS_PROVIDER,
  GameStats,
  PlayerStats,
  STAT_TYPE,
  TeamStats,
} from 'types';
import { GameStatsService } from '../../game-stats/game-stats.service';
import { GameStatsRepository } from '../../game-stats/game-stats-repositories/game-stats-repository.interface';
import { DiscrepanciesService } from '../discrepancies.service';

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
    teamId: 'ba27615c-07df-41f0-864b-332575f744f2',
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
    sourceId: GAME_STATS_PROVIDER.SPORT_RADAR,
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
    playerId: 'e11a2815-8f31-44b0-8c37-64240bcbc059',
    stats: {
      receivingReceptions: 9,
      receivingYards: 47,
      rushAttempts: null,
      rushTouchdowns: null,
      rushYards: null,
    },
  },
];

describe('DiscrepanciesController', () => {
  let controller: DiscrepanciesController;
  const mockedGameStatsInMemoryRepository = new MockedGameStatsInMemoryRepository();
  mockedGameStatsInMemoryRepository.seed([
    ...MOCKED_STATS_FOR_GAME,
    ...MOCKED_STATS_FOR_TEAM,
    ...MOCKED_STATS_FOR_PLAYER,
  ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscrepanciesController],
      providers: [
        GameStatsService,
        DiscrepanciesService,
        { provide: GameStatsRepository, useValue: mockedGameStatsInMemoryRepository },
      ],
    }).compile();

    controller = module.get<DiscrepanciesController>(DiscrepanciesController);
  });

  it('should return discrepancies for provided TYPE query', async () => {
    // given
    const TYPES = [DISCREPANCIES_TYPE.GAME, DISCREPANCIES_TYPE.TEAM, DISCREPANCIES_TYPE.PLAYER];

    // when
    for (const discrepancyType of TYPES) {
      const discrepancies = await controller.getAllDiscrepancies({ type: discrepancyType });

      // then
      expect(
        discrepancies.every(
          discrepancy => discrepancy.meta.statType.toString() === discrepancyType,
        ),
      ).toBe(true);
      expect(discrepancies.every(discrepancy => discrepancy.statName)).toBeDefined();
      expect(discrepancies.every(discrepancy => discrepancy.values)).toBeDefined();
    }
  });

  it('should return discrepancies for ALL query or when type is not provided', async () => {
    // given
    const TYPES = [DISCREPANCIES_TYPE.ALL, undefined];

    // when
    for (const discrepancyType of TYPES) {
      const discrepancies = await controller.getAllDiscrepancies({ type: discrepancyType });

      // then
      expect(discrepancies.every(discrepancy => discrepancy.meta.gameId === MOCKED_GAME_ID)).toBe(
        true,
      );
      expect(discrepancies.every(discrepancy => discrepancy.meta.statType !== undefined)).toBe(
        true,
      );

      expect(discrepancies.some(discrepancy => discrepancy.meta.statType === STAT_TYPE.GAME)).toBe(
        true,
      );
      expect(discrepancies.some(discrepancy => discrepancy.meta.statType === STAT_TYPE.TEAM)).toBe(
        true,
      );
      expect(
        discrepancies.some(discrepancy => discrepancy.meta.statType === STAT_TYPE.PLAYER),
      ).toBe(true);
    }
  });
});
