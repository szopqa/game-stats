import {
  GAME_STATS_PROVIDER,
  GameStats,
  PlayerStats,
  STAT_TYPE,
  SportRadarGameStats,
  SportRadarReceivingTeam,
  SportRadarRushingTeam,
  SportRadarTeam,
  TeamStats,
} from 'types';
import { IGameStatsMappingStrategy } from './game-stats-mapping-strategy.interface';
import { uniqBy } from 'lodash';

export default class SportRadarGameStatsMappingStrategy
  implements IGameStatsMappingStrategy<SportRadarGameStats>
{
  readonly statSourceId = GAME_STATS_PROVIDER.SPORT_RADAR;

  private mapTeamStats(gameId: string, teamStats: SportRadarTeam): TeamStats {
    const { id, receiving, rushing } = teamStats;

    return {
      gameId,
      sourceId: this.statSourceId,
      statType: STAT_TYPE.TEAM,
      teamId: id,
      stats: {
        receivingReceptions: receiving.totals?.receptions ?? null,
        receivingYards: receiving.totals.yards ?? null,
        rushTouchdowns: rushing.totals?.touchdowns ?? null,
        rushYards: rushing.totals?.yards ?? null,
        rushAttempts: rushing.totals?.attempts ?? null,
      },
    };
  }

  private mapTeamPlayerStats(
    gameId: string,
    teamId: string,
    receiving: SportRadarReceivingTeam,
    rushing: SportRadarRushingTeam,
  ): PlayerStats[] {
    const { players: rushingPlayers } = rushing;
    const { players: receivingPlayers } = receiving;

    const receivingPlayersStats: PlayerStats[] = receivingPlayers.map(player => ({
      gameId,
      teamId,
      playerId: player.id,
      sourceId: this.statSourceId,
      statType: STAT_TYPE.PLAYER,
      stats: {
        receivingReceptions: player.receptions ?? null,
        receivingYards: player.yards ?? null,
        rushAttempts: null,
        rushTouchdowns: null,
        rushYards: null,
      },
    }));

    const rushingPlayersStats = rushingPlayers.map(player => {
      const correspondingReceivingStatsForPlayer = receivingPlayersStats.find(
        p => p.playerId === player.id,
      )?.stats;

      return {
        gameId,
        teamId,
        playerId: player.id,
        sourceId: this.statSourceId,
        statType: STAT_TYPE.PLAYER,
        stats: {
          rushAttempts: player.attempts ?? null,
          rushTouchdowns: player.touchdowns ?? null,
          rushYards: player.yards ?? null,
          receivingReceptions: correspondingReceivingStatsForPlayer?.receivingReceptions ?? null,
          receivingYards: correspondingReceivingStatsForPlayer?.receivingYards ?? null,
        },
      };
    });

    return uniqBy([...rushingPlayersStats, ...receivingPlayersStats], 'playerId');
  }

  mapToGameStats(gameStats: SportRadarGameStats): GameStats {
    const {
      game: { attendance, id },
      statistics: { home, away },
    } = gameStats;

    return {
      gameId: id,
      sourceId: this.statSourceId,
      statType: STAT_TYPE.GAME,
      awayTeamId: away.id,
      homeTeamId: home.id,
      stats: {
        attendance,
      },
    };
  }

  mapToTeamsStats(gameStats: SportRadarGameStats): TeamStats[] {
    const {
      game: { id },
      statistics: { home, away },
    } = gameStats;

    return [away, home].map(teamStats => this.mapTeamStats(id, teamStats));
  }

  mapToPlayersStats(gameStats: SportRadarGameStats): PlayerStats[] {
    const {
      game: { id },
      statistics: { home, away },
    } = gameStats;

    return [away, home].flatMap(team =>
      this.mapTeamPlayerStats(id, team.id, team.receiving, team.rushing),
    );
  }
}
