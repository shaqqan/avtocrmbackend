import { Module } from '@nestjs/common';
import { StatisticsModule } from './statistics/statistics.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [StatisticsModule, BookModule]
})
export class CoreModule {}
