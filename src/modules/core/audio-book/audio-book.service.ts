import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AudioBook,
  AudioBookPublishedEnum,
} from 'src/databases/typeorm/entities';
import { RedisService } from 'src/databases/redis/redis.service';
import { currentLocale } from 'src/common/utils';
import { decodeHTML } from 'entities';

@Injectable({ scope: Scope.DEFAULT })
export class AudioBookService {
  constructor(
    @InjectRepository(AudioBook)
    private readonly audioBookRepository: Repository<AudioBook>,
    private readonly redisService: RedisService,
  ) {}

  async byRating() {
    const currentLang = currentLocale();
    const cachedData = await this.redisService.get(
      `core:top-audiobooks:${currentLang}`,
    );
    if (cachedData) {
      return cachedData;
    }

    const audiobooks = await this.audioBookRepository
      .createQueryBuilder('audiobook')
      .leftJoin('audiobook.reviews', 'review')
      .leftJoin('audiobook.authors', 'author')
      .select([
        'audiobook.id',
        'audiobook.cover',
        `audiobook.name_${currentLang}`,
        'audiobook.published',
        'audiobook.duration',
        'audiobook.createdAt',
      ])
      .addSelect('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .addSelect(
        `GROUP_CONCAT(DISTINCT author.name_${currentLang})`,
        'authorNames',
      )
      .where('audiobook.published = :published', {
        published: AudioBookPublishedEnum.PUBLISHED,
      })
      .groupBy('audiobook.id')
      .orderBy('averageRating', 'DESC')
      .addOrderBy('reviewCount', 'DESC')
      .limit(50)
      .getRawMany();

    const data = audiobooks.map((audiobook) => ({
      id: audiobook.audiobook_id,
      cover: global.asset(audiobook.audiobook_cover),
      avgRating: parseFloat(audiobook.averageRating) || 5.0,
      reviewCount: parseInt(audiobook.reviewCount) || 0,
      name: decodeHTML(audiobook[`audiobook_name_${currentLang}`]),
      duration: audiobook.audiobook_duration,
      authors: audiobook.authorNames
        ? audiobook.authorNames.split(',').map(decodeHTML)
        : [],
    }));

    await this.redisService.set(
      `core:top-audiobooks:${currentLang}`,
      data,
      60 * 60 * 24, // 24 hours cache
    );

    return data;
  }
}
