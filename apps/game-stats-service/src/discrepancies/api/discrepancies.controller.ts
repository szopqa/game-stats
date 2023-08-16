import { Controller, Get, Param, Query } from '@nestjs/common';
import { DiscrepanciesQueryDto, DiscrepancyDto } from '../dto/discrepancies.dto';
import { DiscrepanciesService } from '../discrepancies.service';
import { DISCREPANCIES_TYPE, STAT_TYPE } from 'types';

@Controller('discrepancies')
export class DiscrepanciesController {
  constructor(private readonly discrepanciesService: DiscrepanciesService) {}

  @Get()
  async getAllDiscrepancies(@Query() query: DiscrepanciesQueryDto): Promise<DiscrepancyDto[]> {
    const { type } = query;
    const discrepancyType = type ?? DISCREPANCIES_TYPE.ALL;

    if (discrepancyType === DISCREPANCIES_TYPE.ALL) {
      return this.discrepanciesService.getAllDiscrepancies();
    }

    return this.discrepanciesService.getDiscrepancies(STAT_TYPE[discrepancyType]);
  }

  @Get('/:gameId')
  async getAllDiscrepanciesForGameWithId(
    @Param('gameId') gameId: string,
    @Query() query: DiscrepanciesQueryDto,
  ): Promise<DiscrepancyDto[]> {
    const { type } = query;

    const discrepancyType = type ?? DISCREPANCIES_TYPE.ALL;

    if (discrepancyType === DISCREPANCIES_TYPE.ALL) {
      return this.discrepanciesService.getAllDiscrepancies({ gameId });
    }

    return this.discrepanciesService.getDiscrepancies(STAT_TYPE[discrepancyType], {
      gameId,
    });
  }
}
