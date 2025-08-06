import { Injectable, Scope } from '@nestjs/common';
import { IsNull } from 'typeorm';
import {
  AudioBook,
  AudioBookPublishedEnum,
} from 'src/databases/typeorm/entities/audio-book.entity';
import {
  Book,
  PublishedEnum,
  ReviewBook,
  ReviewsAudiobook,
} from 'src/databases/typeorm/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/databases/redis/redis.service';

@Injectable({ scope: Scope.DEFAULT })
export class StatisticsService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(AudioBook)
    private readonly audioBookRepository: Repository<AudioBook>,
    @InjectRepository(ReviewBook)
    private readonly reviewBookRepository: Repository<ReviewBook>,
    @InjectRepository(ReviewsAudiobook)
    private readonly reviewsAudiobookRepository: Repository<ReviewsAudiobook>,
    private readonly redisService: RedisService,
  ) {}

  public async statistics() {
    const cachedStatistics = await this.redisService.get('core:statistics');
    if (cachedStatistics) {
      return cachedStatistics;
    }

    const [
      booksCount,
      audioBooksCount,
      reviewBookCount,
      reviewsAudiobookCount,
    ] = await Promise.all([
      this.bookRepository.count({
        where: {
          published: PublishedEnum.PUBLISHED,
          deletedAt: IsNull(),
        },
      }),
      this.audioBookRepository.count({
        where: {
          published: AudioBookPublishedEnum.PUBLISHED,
        },
      }),
      this.reviewBookRepository.count(),
      this.reviewsAudiobookRepository.count(),
    ]);

    const statistics = {
      books: booksCount,
      audioBooks: audioBooksCount,
      readers: reviewBookCount + reviewsAudiobookCount,
    };

    await this.redisService.set('core:statistics', statistics);
    return statistics;
  }
}
