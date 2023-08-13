export type SportRadarGameStats = {
  sourceId: string;
  game: SportRadarGame;
  statistics: SportRadarStatistics;
};

export type SportRadarGame = {
  id: string;
  attendance: number;
};

export type SportRadarStatistics = {
  home: SportRadarTeam;
  away: SportRadarTeam;
};

export type SportRadarTeam = {
  id: string;
  rushing: SportRadarRushingTeam;
  receiving: SportRadarReceivingTeam;
};

export type SportRadarReceivingTeam = {
  totals: SportRadarReceivingStats;
  players: ReceivingPlayer[];
};

export type SportRadarRushingTeam = {
  totals: SportRadarRushingStats;
  players: RushingPlayer[];
};

export type SportRadarRushingStats = {
  attempts?: number;
  touchdowns?: number;
  yards?: number;
};

export type SportRadarReceivingStats = {
  receptions?: number;
  yards?: number;
};

export type RushingPlayer = SportRadarRushingStats & {
  id: string;
};

export type ReceivingPlayer = SportRadarReceivingStats & {
  id: string;
};
