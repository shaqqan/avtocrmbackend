import { Module } from '@nestjs/common';
import { StatisticsModule } from './statistics/statistics.module';
import { BookModule } from './book/book.module';
import { AudioBookModule } from './audio-book/audio-book.module';

@Module({
  imports: [StatisticsModule, BookModule, AudioBookModule],
})
export class CoreModule {}
