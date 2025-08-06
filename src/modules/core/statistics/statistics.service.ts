import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { AudioBook, AudioBookPublishedEnum } from 'src/databases/typeorm/entities/audio-book.entity';
import { Book, PublishedEnum, ReviewBook, ReviewsAudiobook } from 'src/databases/typeorm/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/databases/redis/redis.service';

@Injectable()
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
  ) { }

  public async statistics() {
    const cachedStatistics = await this.redisService.get('core:statistics');
    if (cachedStatistics) {
      return cachedStatistics;
    }

    // Count published books
    const booksCount = await this.bookRepository.count({
      select: {
        id: true,
        published: true,
      },
      where: {
        published: PublishedEnum.PUBLISHED,
        deletedAt: IsNull(), // Exclude soft-deleted books
      },
    });

    // Count published audiobooks
    const audioBooksCount = await this.audioBookRepository.count({
      select: {
        id: true,
        published: true,
      },
      where: {
        published: AudioBookPublishedEnum.PUBLISHED,
      },
    });

    const [reviewBookCount, reviewsAudiobookCount] = await Promise.all([
      await this.reviewBookRepository.count({
        select: {
          id: true,
        },
      }),
      await this.reviewsAudiobookRepository.count({
        select: {
          id: true,
        },
      }),
    ]);
    const readers = reviewBookCount + reviewsAudiobookCount;

    const statistics = {
      books: booksCount,
      audioBooks: audioBooksCount,
      readers: readers,
    };
    await this.redisService.set('core:statistics', statistics);
    return statistics;
  }
}
