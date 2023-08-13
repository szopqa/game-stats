import { GAME_STATS_PROVIDER } from 'types';
import { StatsProviderFactory } from './stats-provider.factory';
import { faker } from '@faker-js/faker';

import * as SportRadarGameStats from './sport-radar-provider/fixtures/sport-radar-game-stats.data';
import * as ExternalAGameStats from './external-A-provider/fixtures/external-a-game-stats.data';

describe('StatsProviderFactory', () => {
  it('should create new external system stats provider and get the stats', async () => {
    // given
    const MOCKED_GAME_ID = faker.string.uuid();
    const provider = StatsProviderFactory.createProvider(GAME_STATS_PROVIDER.EXTERNAL_A);

    // when
    const stats = await provider.getStatsForGame(MOCKED_GAME_ID);

    // then
    expect(stats).toBe(ExternalAGameStats);
  });

  it('should create new sport radar system stats provider and get the stats', async () => {
    // given
    const MOCKED_GAME_ID = faker.string.uuid();
    const provider = StatsProviderFactory.createProvider(GAME_STATS_PROVIDER.SPORT_RADAR);

    // when
    const stats = await provider.getStatsForGame(MOCKED_GAME_ID);

    // then
    expect(stats).toBe(SportRadarGameStats);
  });
});
