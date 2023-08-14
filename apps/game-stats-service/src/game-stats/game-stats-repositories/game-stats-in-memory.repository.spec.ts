import { Test, TestingModule } from '@nestjs/testing';
import { GameStatsInMemoryRepository } from './game-stats-in-memory.repository';

describe('GameStatsInMemoryRepository', () => {
  let service: GameStatsInMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameStatsInMemoryRepository],
    }).compile();

    service = module.get<GameStatsInMemoryRepository>(GameStatsInMemoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
