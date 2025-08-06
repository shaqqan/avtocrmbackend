import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AudioBook,
  AudioBookPublishedEnum,
} from 'src/databases/typeorm/entities';
import { currentLocale } from 'src/common/utils';
import { RedisService } from 'src/databases/redis/redis.service';
import { decodeHTML } from 'entities';

@Injectable()
export class AudioBookService {
  constructor(
    @InjectRepository(AudioBook)
    private readonly audioBookRepository: Repository<AudioBook>,
    private readonly redisService: RedisService,
  ) { }

  async byRating() {
    const locale = currentLocale();
    const cachedData = await this.redisService.get(
      `core:audio-books:by-rating:${locale}`,
    );
    if (cachedData) {
      return cachedData;
    }

    const results = await this.audioBookRepository
      .createQueryBuilder('audiobook')
      .leftJoin('audiobook.reviews', 'review')
      .leftJoin('audiobook.authors', 'author')
      .select([
        'audiobook.id',
        'audiobook.cover',
        `audiobook.name_${locale}`,
        'audiobook.published',
      ])
      .addSelect('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .addSelect(`GROUP_CONCAT(DISTINCT author.name_${locale})`, 'authorNames')
      .where('audiobook.published = :published', {
        published: AudioBookPublishedEnum.PUBLISHED,
      })
      .groupBy('audiobook.id')
      .orderBy('averageRating', 'DESC')
      .addOrderBy('reviewCount', 'DESC')
      .limit(50)
      .getRawMany();

    const data = results.map((result) => ({
      id: result.audiobook_id,
      cover: global.asset(result.audiobook_cover),
      avgRating: parseFloat(result.averageRating) || 5.0,
      reviewCount: parseInt(result.reviewCount) || 0,
      name: decodeHTML(result[`audiobook_name_${locale}`]),
      authors: result.authorNames ? result.authorNames.split(',').map(decodeHTML) : [],
    }));

    await this.redisService.set(
      `core:audio-books:by-rating:${locale}`,
      data,
    );

    return data;
  }
}
