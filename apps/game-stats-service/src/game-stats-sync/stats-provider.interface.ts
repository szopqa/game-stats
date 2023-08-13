export interface IGameStatsProvider {
  getStatsForGame<T>(gameIdentifier: string): Promise<T>;
}
