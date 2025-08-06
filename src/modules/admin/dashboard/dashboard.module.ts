import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AudioBook,
  Author,
  Book,
  Genre,
  Issuer,
  News,
  ReviewBook,
  ReviewsAudiobook,
} from 'src/databases/typeorm/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book,
      AudioBook,
      Author,
      Genre,
      Issuer,
      News,
      ReviewBook,
      ReviewsAudiobook,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
