import { Test, TestingModule } from '@nestjs/testing';
import { DiscrepanciesService } from './discrepancies.service';
import { faker } from '@faker-js/faker';
import { GAME_STATS_PROVIDER, GameStats, PlayerStats, STAT_TYPE, TeamStats } from 'types';
import { GameStatsRepository } from '../game-stats/game-stats-repositories/game-stats-repository.interface';
import { GameStatsService } from '../game-stats/game-stats.service';
import { MockedGameStatsInMemoryRepository } from '../game-stats/game-stats-repositories/mocked-game-stats-in-memory.repository';

const MOCKED_GAME_ID = faker.string.uuid();
const MOCKED_TEAM_ID = faker.string.uuid();
const MOCKED_PLAYER_ID = faker.string.uuid();

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
    teamId: MOCKED_TEAM_ID,
    stats: {
      receivingReceptions: 27,
      receivingYards: 239,
      rushTouchdowns: 0,
      rushYards: 78,
      rushAttempts: 39,
    },
  },
  {
    gameId: MOCKED_GAME_ID,
    sourceId: GAME_STATS_PROVIDER.SPORT_RADAR,
    statType: STAT_TYPE.TEAM,
    teamId: MOCKED_TEAM_ID,
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
    playerId: MOCKED_PLAYER_ID,
    stats: {
      receivingReceptions: 9,
      receivingYards: 47,
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
    playerId: MOCKED_PLAYER_ID,
    stats: {
      receivingReceptions: 9,
      receivingYards: 47,
      rushAttempts: 14,
      rushTouchdowns: 6,
      rushYards: 79,
    },
  },
];

describe('DiscrepanciesService', () => {
  let service: DiscrepanciesService;
  const mockedGameStatsInMemoryRepository = new MockedGameStatsInMemoryRepository();
  mockedGameStatsInMemoryRepository.seed([
    ...MOCKED_STATS_FOR_GAME,
    ...MOCKED_STATS_FOR_TEAM,
    ...MOCKED_STATS_FOR_PLAYER,
  ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscrepanciesService,
        GameStatsService,
        { provide: GameStatsRepository, useValue: mockedGameStatsInMemoryRepository },
      ],
    }).compile();

    service = module.get<DiscrepanciesService>(DiscrepanciesService);
  });

  it('getDiscrepancies should provide discrepancies for given type and their metadata', async () => {
    // given
    const STAT_TYPES = [STAT_TYPE.GAME, STAT_TYPE.TEAM, STAT_TYPE.PLAYER];

    // when
    for (const statType of STAT_TYPES) {
      const discrepancies = await service.getDiscrepancies(statType, { gameId: MOCKED_GAME_ID });

      // then
      expect(discrepancies.every(discrepancy => discrepancy.meta.statType === statType)).toBe(true);
      expect(discrepancies.every(discrepancy => discrepancy.statName)).toBeDefined();
      expect(discrepancies.every(discrepancy => discrepancy.values)).toBeDefined();
    }
  });

  it('should correctly calculate and return discrepancies for GAME stats', async () => {
    // given
    const statType = STAT_TYPE.GAME;

    // when
    const discrepancies = await service.getDiscrepancies(statType, { gameId: MOCKED_GAME_ID });

    // then
    expect(discrepancies.every(discrepancy => discrepancy.meta.statType === statType)).toBe(true);
    expect(discrepancies.length).toBe(1);

    const [discrepancy] = discrepancies;
    expect(discrepancy.statName).toBe('attendance');
    expect(discrepancy.meta).toStrictEqual({
      statType: STAT_TYPE.GAME,
      id: `${MOCKED_GAME_ID}__GAME__attendance`,
      awayTeamId: 'ba27615c-07df-41f0-864b-332575f744f2',
      homeTeamId: '344e408b-846e-44ac-b491-7802ab0f7af0',
      gameId: MOCKED_GAME_ID,
    });
    expect(discrepancy.values).toStrictEqual([
      {
        sourceId: 'sr',
        value: 62487,
      },
      {
        sourceId: 'external',
        value: 33876,
      },
    ]);
  });

  it('should correctly calculate and return discrepancies for TEAM stats', async () => {
    // given
    const statType = STAT_TYPE.TEAM;

    // when
    const discrepancies = await service.getDiscrepancies(statType, { gameId: MOCKED_GAME_ID });

    // then
    expect(discrepancies.every(discrepancy => discrepancy.meta.statType === statType)).toBe(true);
    expect(discrepancies.every(discrepancy => discrepancy.meta.gameId === MOCKED_GAME_ID)).toBe(
      true,
    );
    expect(discrepancies.length).toBe(2);

    discrepancies.forEach(discrepancy => {
      expect(['receivingReceptions', 'receivingYards']).toContain(discrepancy.statName);
      expect(discrepancy.meta).toEqual(
        expect.objectContaining({
          statType: STAT_TYPE.TEAM,
          teamId: MOCKED_TEAM_ID,
          gameId: MOCKED_GAME_ID,
        }),
      );
    });

    const receivingReceptionsDiscrepancy = discrepancies.find(
      discrepancy => discrepancy.statName === 'receivingReceptions',
    );
    const receivingYardsDiscrepancy = discrepancies.find(
      discrepancy => discrepancy.statName === 'receivingYards',
    );

    expect(receivingReceptionsDiscrepancy!.values).toEqual(
      expect.arrayContaining([
        {
          sourceId: GAME_STATS_PROVIDER.SPORT_RADAR,
          value: 31,
        },
        {
          sourceId: GAME_STATS_PROVIDER.EXTERNAL_A,
          value: 27,
        },
      ]),
    );

    expect(receivingYardsDiscrepancy!.values).toEqual(
      expect.arrayContaining([
        {
          sourceId: GAME_STATS_PROVIDER.SPORT_RADAR,
          value: 257,
        },
        {
          sourceId: GAME_STATS_PROVIDER.EXTERNAL_A,
          value: 239,
        },
      ]),
    );
  });

  it('should correctly calculate and return discrepancies for PLAYER stats', async () => {
    // given
    const statType = STAT_TYPE.PLAYER;

    // when
    const discrepancies = await service.getDiscrepancies(statType, { gameId: MOCKED_GAME_ID });

    // then
    expect(discrepancies.every(discrepancy => discrepancy.meta.statType === statType)).toBe(true);
    expect(discrepancies.every(discrepancy => discrepancy.meta.gameId === MOCKED_GAME_ID)).toBe(
      true,
    );
    expect(discrepancies.length).toBe(2);

    discrepancies.forEach(discrepancy => {
      expect(['rushTouchdowns', 'rushYards']).toContain(discrepancy.statName);
      expect(discrepancy.meta).toEqual(
        expect.objectContaining({
          statType: STAT_TYPE.PLAYER,
          gameId: MOCKED_GAME_ID,
          playerId: MOCKED_PLAYER_ID,
        }),
      );
    });

    const rushTouchdownsDiscrepancy = discrepancies.find(
      discrepancy => discrepancy.statName === 'rushTouchdowns',
    );
    const rushYardsDiscrepancy = discrepancies.find(
      discrepancy => discrepancy.statName === 'rushYards',
    );

    expect(rushTouchdownsDiscrepancy!.values).toEqual(
      expect.arrayContaining([
        {
          sourceId: GAME_STATS_PROVIDER.SPORT_RADAR,
          value: 2,
        },
        {
          sourceId: GAME_STATS_PROVIDER.EXTERNAL_A,
          value: 6,
        },
      ]),
    );

    expect(rushYardsDiscrepancy!.values).toEqual(
      expect.arrayContaining([
        {
          sourceId: GAME_STATS_PROVIDER.SPORT_RADAR,
          value: 73,
        },
        {
          sourceId: GAME_STATS_PROVIDER.EXTERNAL_A,
          value: 79,
        },
      ]),
    );
  });

  it('getAllDiscrepancies should provide discrepancies ALL types and their metadata', async () => {
    // given
    const query = { gameId: MOCKED_GAME_ID };

    // when
    const discrepancies = await service.getAllDiscrepancies(query);

    // then
    expect(discrepancies.every(discrepancy => discrepancy.meta.gameId === MOCKED_GAME_ID)).toBe(
      true,
    );
    expect(discrepancies.every(discrepancy => discrepancy.meta.statType !== undefined)).toBe(true);

    expect(discrepancies.some(discrepancy => discrepancy.meta.statType === STAT_TYPE.GAME)).toBe(
      true,
    );
    expect(discrepancies.some(discrepancy => discrepancy.meta.statType === STAT_TYPE.TEAM)).toBe(
      true,
    );
    expect(discrepancies.some(discrepancy => discrepancy.meta.statType === STAT_TYPE.PLAYER)).toBe(
      true,
    );
    expect(discrepancies.length).toBe(5);
  });
});
