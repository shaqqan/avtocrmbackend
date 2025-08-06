import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('core/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  @Get()
  statistics() {
    return this.statisticsService.statistics();
  }
}
