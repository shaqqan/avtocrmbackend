import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AudioBook,
  Book,
  ReviewBook,
  ReviewsAudiobook,
} from 'src/databases/typeorm/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, AudioBook, ReviewBook, ReviewsAudiobook]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
