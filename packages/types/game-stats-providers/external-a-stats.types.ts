export type ExternalAGameStats = {
  sourceId: string;
  game: ExternalAGame;
};

export type ExternalAGame = {
  id: string;
  attendance: number;
  home: ExternalATeam;
  away: ExternalATeam;
};

export type ExternalAStats = {
  rushAttempts?: number;
  rushTds?: number;
  rushYdsGained?: number;
  rec?: number;
  receivingYards?: number;
};

export type ExternalAPlayer = ExternalAStats & {
  id: string;
};

export type ExternalATeam = ExternalAStats & {
  id: string;
  players: ExternalAPlayer[];
};
