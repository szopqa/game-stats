import ExternalAGameStatsMappingStrategy from './external-a-mapping.strategy';
import { ExternalAGameStats, ExternalAStats } from 'types';
import { faker } from '@faker-js/faker';
import { set } from 'lodash';
import { externalAGameStats } from '../../game-stats-sync/external-A-provider/fixtures/external-a-game-stats.data';

describe('ExternalAGameStatsMappingStrategy', () => {
  const externalAGameStatsMappingStrategy = new ExternalAGameStatsMappingStrategy();
  describe('mapping game statistics', () => {
    it('should correctly map game statistics for stats coming from external system', () => {
      // given
      const testGameStats: ExternalAGameStats = Object.assign({}, externalAGameStats);

      const MOCKED_GAME_ID = faker.string.uuid();
      const MOCKED_ATTENDANCE = faker.number.int({ min: 100, max: 10 * 1000 });
      const MOCKED_AWAY_TEAM_ID = faker.string.uuid();
      const MOCKED_HOME_TEAM_ID = faker.string.uuid();

      set(testGameStats, 'game.id', MOCKED_GAME_ID);
      set(testGameStats, 'game.attendance', MOCKED_ATTENDANCE);
      set(testGameStats, 'game.home.id', MOCKED_HOME_TEAM_ID);
      set(testGameStats, 'game.away.id', MOCKED_AWAY_TEAM_ID);

      // when
      const mappedGameStats = externalAGameStatsMappingStrategy.mapToGameStats(testGameStats);

      // then
      expect(mappedGameStats).toEqual({
        gameId: MOCKED_GAME_ID,
        awayTeamId: MOCKED_AWAY_TEAM_ID,
        homeTeamId: MOCKED_HOME_TEAM_ID,
        sourceId: 'external',
        statType: 'GAME',
        stats: {
          attendance: MOCKED_ATTENDANCE,
        },
      });
    });
  });

  describe('mapping team statistics', () => {
    const defaultTeamStatsFakeOptions = {
      min: 0,
      max: 20,
    };
    const mockTeamStats = (): ExternalAStats => ({
      rushAttempts: faker.number.int(defaultTeamStatsFakeOptions),
      rushTds: faker.number.int(defaultTeamStatsFakeOptions),
      rushYdsGained: faker.number.int(defaultTeamStatsFakeOptions),
      rec: faker.number.int(defaultTeamStatsFakeOptions),
      receivingYards: faker.number.int(defaultTeamStatsFakeOptions),
    });

    it('should correctly map team statistics for stats coming from external system', () => {
      // given
      const testGameStats: ExternalAGameStats = Object.assign({}, externalAGameStats);

      const MOCKED_GAME_ID = faker.string.uuid();
      const MOCKED_AWAY_TEAM_ID = faker.string.uuid();
      const MOCKED_HOME_TEAM_ID = faker.string.uuid();

      set(testGameStats, 'game.id', MOCKED_GAME_ID);

      const mockedHomeTeamStats = mockTeamStats();
      const mockedAwayTeamStats = mockTeamStats();
      const {
        game: { away, home },
      } = testGameStats;

      Object.assign(testGameStats, {
        game: {
          ...testGameStats.game,
          home: {
            ...home,
            id: MOCKED_HOME_TEAM_ID,
            ...mockedHomeTeamStats,
          },
          away: {
            ...away,
            id: MOCKED_AWAY_TEAM_ID,
            ...mockedAwayTeamStats,
          },
        },
      });

      // when
      const [mappedAwayTeamStats, mappedHomeTeamStats] =
        externalAGameStatsMappingStrategy.mapToTeamsStats(testGameStats);

      // then
      expect(mappedAwayTeamStats).toEqual({
        gameId: MOCKED_GAME_ID,
        sourceId: 'external',
        statType: 'TEAM',
        teamId: MOCKED_AWAY_TEAM_ID,
        stats: {
          receivingReceptions: mockedAwayTeamStats.rec,
          rushTouchdowns: mockedAwayTeamStats.rushTds,
          rushYards: mockedAwayTeamStats.rushYdsGained,
          rushAttempts: mockedAwayTeamStats.rushAttempts,
          receivingYards: mockedAwayTeamStats.receivingYards,
        },
      });

      expect(mappedHomeTeamStats).toEqual({
        gameId: MOCKED_GAME_ID,
        sourceId: 'external',
        statType: 'TEAM',
        teamId: MOCKED_HOME_TEAM_ID,
        stats: {
          receivingReceptions: mockedHomeTeamStats.rec,
          rushTouchdowns: mockedHomeTeamStats.rushTds,
          rushYards: mockedHomeTeamStats.rushYdsGained,
          rushAttempts: mockedHomeTeamStats.rushAttempts,
          receivingYards: mockedHomeTeamStats.receivingYards,
        },
      });
    });
  });

  describe('mapping player statistics', () => {
    const defaultTeamStatsFakeOptions = {
      min: 0,
      max: 20,
    };

    const mockPlayerStats = (): ExternalAStats => ({
      rushAttempts: faker.number.int(defaultTeamStatsFakeOptions),
      rushTds: faker.number.int(defaultTeamStatsFakeOptions),
      rushYdsGained: faker.number.int(defaultTeamStatsFakeOptions),
      rec: faker.number.int(defaultTeamStatsFakeOptions),
      receivingYards: faker.number.int(defaultTeamStatsFakeOptions),
    });

    it('should correctly map all players statistics for the stats coming from external system', () => {
      // given
      const MOCKED_GAME_ID = faker.string.uuid();
      const MOCKED_AWAY_TEAM_ID = faker.string.uuid();
      const MOCKED_HOME_TEAM_ID = faker.string.uuid();

      const MOCKED_HOME_P1_STATS = mockPlayerStats();
      const MOCKED_HOME_P1_ID = faker.string.uuid();

      const MOCKED_HOME_P2_STATS = mockPlayerStats();
      const MOCKED_HOME_P2_ID = faker.string.uuid();

      const MOCKED_AWAY_P1_STATS = mockPlayerStats();
      const MOCKED_AWAY_P1_ID = faker.string.uuid();

      const mockedGameStats = {
        sourceId: 'external',
        game: {
          id: MOCKED_GAME_ID,
          attendance: 123,
          home: {
            id: MOCKED_HOME_TEAM_ID,
            players: [
              {
                id: MOCKED_HOME_P1_ID,
                ...MOCKED_HOME_P1_STATS,
              },
              {
                id: MOCKED_HOME_P2_ID,
                ...MOCKED_HOME_P2_STATS,
              },
            ],
          },
          away: {
            id: MOCKED_AWAY_TEAM_ID,
            players: [
              {
                id: MOCKED_AWAY_P1_ID,
                ...MOCKED_AWAY_P1_STATS,
              },
            ],
          },
        },
      };

      // when
      const playersStats = externalAGameStatsMappingStrategy.mapToPlayersStats(mockedGameStats);

      // then
      expect(playersStats.length).toBe(3);
      expect(
        playersStats.every(
          playerStat =>
            playerStat.gameId === MOCKED_GAME_ID &&
            playerStat.sourceId === 'external' &&
            playerStat.statType === 'PLAYER',
        ),
      ).toBe(true);

      expect(playersStats).toEqual(
        expect.arrayContaining([
          {
            gameId: MOCKED_GAME_ID,
            teamId: MOCKED_HOME_TEAM_ID,
            sourceId: 'external',
            statType: 'PLAYER',
            playerId: MOCKED_HOME_P1_ID,
            stats: {
              receivingReceptions: MOCKED_HOME_P1_STATS.rec,
              rushTouchdowns: MOCKED_HOME_P1_STATS.rushTds,
              rushYards: MOCKED_HOME_P1_STATS.rushYdsGained,
              rushAttempts: MOCKED_HOME_P1_STATS.rushAttempts,
              receivingYards: MOCKED_HOME_P1_STATS.receivingYards,
            },
          },
        ]),
      );
    });
  });
});
