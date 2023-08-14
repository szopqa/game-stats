import { SportRadarGameStats } from 'types';
import { faker } from '@faker-js/faker';
import { set } from 'lodash';
import SportRadarGameStatsMappingStrategy from './sport-radar-mapping.strategy';
import { sportRadarGameStatsFixture } from './fixtures/sport-radar-game-stats.fixture';

describe('SportRadarGameStatsMappingStrategy', () => {
  const sportRadarGameStatsMappingStrategy = new SportRadarGameStatsMappingStrategy();

  describe('mapping game statistics', () => {
    it('should correctly map game statistics for stats coming from sport radar system', () => {
      // given
      const testGameStats: SportRadarGameStats = Object.assign({}, sportRadarGameStatsFixture);

      const MOCKED_GAME_ID = faker.string.uuid();
      const MOCKED_ATTENDANCE = faker.number.int({ min: 100, max: 10 * 1000 });
      const MOCKED_AWAY_TEAM_ID = faker.string.uuid();
      const MOCKED_HOME_TEAM_ID = faker.string.uuid();

      set(testGameStats, 'game.id', MOCKED_GAME_ID);
      set(testGameStats, 'game.attendance', MOCKED_ATTENDANCE);
      set(testGameStats, 'statistics.home.id', MOCKED_HOME_TEAM_ID);
      set(testGameStats, 'statistics.away.id', MOCKED_AWAY_TEAM_ID);

      // when
      const mappedGameStats = sportRadarGameStatsMappingStrategy.mapToGameStats(testGameStats);

      // then
      expect(mappedGameStats).toEqual({
        gameId: MOCKED_GAME_ID,
        awayTeamId: MOCKED_AWAY_TEAM_ID,
        homeTeamId: MOCKED_HOME_TEAM_ID,
        sourceId: 'sr',
        statType: 'GAME',
        stats: {
          attendance: MOCKED_ATTENDANCE,
        },
      });
    });
  });

  describe('mapping team statistics', () => {
    it('should correctly map teams statistics for stats coming from sport radar system for default provided configuration', () => {
      // given
      const testGameStats: SportRadarGameStats = Object.assign({}, sportRadarGameStatsFixture);

      const MOCKED_GAME_ID = faker.string.uuid();
      const MOCKED_ATTENDANCE = faker.number.int({ min: 100, max: 10 * 1000 });
      const MOCKED_AWAY_TEAM_ID = faker.string.uuid();
      const MOCKED_HOME_TEAM_ID = faker.string.uuid();

      set(testGameStats, 'game.id', MOCKED_GAME_ID);
      set(testGameStats, 'game.attendance', MOCKED_ATTENDANCE);
      set(testGameStats, 'statistics.home.id', MOCKED_HOME_TEAM_ID);
      set(testGameStats, 'statistics.away.id', MOCKED_AWAY_TEAM_ID);

      // when
      const mappedTeamsStats = sportRadarGameStatsMappingStrategy.mapToTeamsStats(testGameStats);

      // then
      expect(mappedTeamsStats.length).toBe(2);
      expect(
        mappedTeamsStats.every(
          teamStat =>
            teamStat.gameId === MOCKED_GAME_ID &&
            teamStat.sourceId === 'sr' &&
            teamStat.statType === 'TEAM',
        ),
      ).toBe(true);

      expect(mappedTeamsStats).toEqual(
        expect.arrayContaining([
          {
            gameId: MOCKED_GAME_ID,
            teamId: MOCKED_HOME_TEAM_ID,
            sourceId: 'sr',
            statType: 'TEAM',
            stats: {
              receivingReceptions: 31,
              rushTouchdowns: 0,
              rushYards: 78,
              rushAttempts: 39,
              receivingYards: 257,
            },
          },
          {
            gameId: MOCKED_GAME_ID,
            teamId: MOCKED_AWAY_TEAM_ID,
            sourceId: 'sr',
            statType: 'TEAM',
            stats: {
              receivingReceptions: 27,
              rushTouchdowns: 1,
              rushYards: 97,
              rushAttempts: 37,
              receivingYards: 239,
            },
          },
        ]),
      );
    });
  });
  describe('mapping players statistics', () => {
    it('should correctly calculate stats for players repeating in both rushing and receiving stats', () => {
      // given
      const testGameStats: SportRadarGameStats = Object.assign({}, sportRadarGameStatsFixture);

      // when
      const mappedPlayersStats =
        sportRadarGameStatsMappingStrategy.mapToPlayersStats(testGameStats);

      // then
      expect(mappedPlayersStats.length).toBe(6);
    });

    it('should correctly calculate stats for players repeating in both rushing and receiving stats assigning corrects stats', () => {
      // given
      const testGameStats: SportRadarGameStats = Object.assign({}, sportRadarGameStatsFixture);

      const MOCKED_GAME_ID = faker.string.uuid();
      const MOCKED_AWAY_TEAM_ID = faker.string.uuid();
      const MOCKED_HOME_TEAM_ID = faker.string.uuid();

      set(testGameStats, 'game.id', MOCKED_GAME_ID);
      set(testGameStats, 'statistics.home.id', MOCKED_HOME_TEAM_ID);
      set(testGameStats, 'statistics.away.id', MOCKED_AWAY_TEAM_ID);

      // when
      const mappedPlayersStats =
        sportRadarGameStatsMappingStrategy.mapToPlayersStats(testGameStats);

      // then
      expect(mappedPlayersStats.length).toBe(6);
      expect(
        mappedPlayersStats.every(
          playerStat =>
            playerStat.gameId === MOCKED_GAME_ID &&
            playerStat.sourceId === 'sr' &&
            playerStat.statType === 'PLAYER',
        ),
      ).toBe(true);

      expect(mappedPlayersStats).toEqual(
        expect.arrayContaining([
          {
            gameId: MOCKED_GAME_ID,
            teamId: MOCKED_AWAY_TEAM_ID,
            playerId: '62f377a6-ff87-4784-9631-05c555c4b14a',
            sourceId: 'sr',
            statType: 'PLAYER',
            stats: {
              rushAttempts: 12,
              rushTouchdowns: 0,
              rushYards: 73,
              receivingReceptions: 2,
              receivingYards: 39,
            },
          },
          {
            gameId: MOCKED_GAME_ID,
            teamId: MOCKED_AWAY_TEAM_ID,
            playerId: 'e11a2815-8f31-44b0-8c37-64240bcbc059',
            sourceId: 'sr',
            statType: 'PLAYER',
            stats: {
              rushAttempts: 14,
              rushTouchdowns: 1,
              rushYards: 76,
              receivingReceptions: null,
              receivingYards: null,
            },
          },
          {
            gameId: MOCKED_GAME_ID,
            teamId: MOCKED_AWAY_TEAM_ID,
            playerId: 'f94fb8a3-cd77-4064-bc65-447550b43622',
            sourceId: 'sr',
            statType: 'PLAYER',
            stats: {
              receivingReceptions: 8,
              receivingYards: 46,
              rushAttempts: null,
              rushTouchdowns: null,
              rushYards: null,
            },
          },
          {
            gameId: MOCKED_GAME_ID,
            teamId: MOCKED_HOME_TEAM_ID,
            playerId: 'e5b67a2e-e0f7-4646-a343-c9bd0ae447f0',
            sourceId: 'sr',
            statType: 'PLAYER',
            stats: {
              rushAttempts: 10,
              rushTouchdowns: 0,
              rushYards: -4,
              receivingReceptions: 8,
              receivingYards: 41,
            },
          },
          {
            gameId: MOCKED_GAME_ID,
            teamId: MOCKED_HOME_TEAM_ID,
            playerId: 'c90711f2-5c4e-4f2e-8635-0d3f2336f581',
            sourceId: 'sr',
            statType: 'PLAYER',
            stats: {
              rushAttempts: 2,
              rushTouchdowns: 0,
              rushYards: -9,
              receivingReceptions: null,
              receivingYards: null,
            },
          },
          {
            gameId: MOCKED_GAME_ID,
            teamId: MOCKED_HOME_TEAM_ID,
            playerId: '713daff7-86cc-4283-91a8-1579c3f58f59',
            sourceId: 'sr',
            statType: 'PLAYER',
            stats: {
              receivingReceptions: 8,
              receivingYards: 88,
              rushAttempts: null,
              rushTouchdowns: null,
              rushYards: null,
            },
          },
        ]),
      );
    });
  });
});
