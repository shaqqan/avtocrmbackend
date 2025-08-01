import { Module } from '@nestjs/common';
import { ReviewsAudiobookService } from './reviews-audiobook.service';
import { ReviewsAudiobookController } from './reviews-audiobook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsAudiobook, AudioBook, User } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewsAudiobook, AudioBook, User])],
  controllers: [ReviewsAudiobookController],
  providers: [ReviewsAudiobookService],
})
export class ReviewsAudiobookModule {}
