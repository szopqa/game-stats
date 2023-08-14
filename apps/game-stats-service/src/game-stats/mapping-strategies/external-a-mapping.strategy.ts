import {
  ExternalAGameStats,
  ExternalAPlayer,
  ExternalATeam,
  GAME_STATS_PROVIDER,
  GameStats,
  PlayerStats,
  STAT_TYPE,
  TeamStats,
} from 'types';
import { IGameStatsMappingStrategy } from './game-stats-mapping-strategy.interface';

export default class ExternalAGameStatsMappingStrategy
  implements IGameStatsMappingStrategy<ExternalAGameStats>
{
  readonly statSourceId = GAME_STATS_PROVIDER.EXTERNAL_A;

  private mapTeamStats(gameId: string, teamStats: ExternalATeam): TeamStats {
    const { id, rec, receivingYards, rushAttempts, rushTds, rushYdsGained } = teamStats;

    return {
      gameId,
      sourceId: this.statSourceId,
      statType: STAT_TYPE.TEAM,
      teamId: id,
      stats: {
        receivingReceptions: rec ?? null,
        rushTouchdowns: rushTds ?? null,
        rushYards: rushYdsGained ?? null,
        rushAttempts: rushAttempts ?? null,
        receivingYards: receivingYards ?? null,
      },
    };
  }

  private mapTeamPlayerStats(
    gameId: string,
    teamId: string,
    teamPlayers: ExternalAPlayer[],
  ): PlayerStats[] {
    return teamPlayers.map(teamPlayer => ({
      gameId,
      teamId,
      sourceId: this.statSourceId,
      statType: STAT_TYPE.PLAYER,
      playerId: teamPlayer.id,
      stats: {
        receivingReceptions: teamPlayer.rec ?? null,
        receivingYards: teamPlayer.receivingYards ?? null,
        rushAttempts: teamPlayer.rushAttempts ?? null,
        rushTouchdowns: teamPlayer.rushTds ?? null,
        rushYards: teamPlayer.rushYdsGained ?? null,
      },
    }));
  }

  mapToGameStats(gameStats: ExternalAGameStats): GameStats {
    // TODO: validate retrieved payload
    const {
      game: { attendance, away, home, id },
    } = gameStats;
    const { id: awayTeamId } = away;
    const { id: homeTeamId } = home;

    return {
      gameId: id,
      awayTeamId,
      homeTeamId,
      sourceId: this.statSourceId,
      statType: STAT_TYPE.GAME,
      stats: {
        attendance: attendance ?? null,
      },
    };
  }

  mapToTeamsStats(gameStats: ExternalAGameStats): TeamStats[] {
    // TODO: validate retrieved payload
    const {
      game: { away, home, id },
    } = gameStats;

    return [away, home].map(teamStats => this.mapTeamStats(id, teamStats));
  }

  mapToPlayersStats(gameStats: ExternalAGameStats): PlayerStats[] {
    // TODO: validate retrieved payload
    const {
      game: { away, home, id },
    } = gameStats;

    return [away, home].flatMap(team => this.mapTeamPlayerStats(id, team.id, team.players));
  }
}
