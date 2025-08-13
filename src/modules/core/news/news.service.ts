import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News, NewsStatus } from 'src/databases/typeorm/entities';
import { RedisService } from 'src/databases/redis/redis.service';
import { currentLocale } from 'src/common/utils';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private readonly redisService: RedisService,
  ) {}

  public async getNewsForHomepage() {
    const currentLang = currentLocale();
    // const cachedData = await this.redisService.get(
    //   `core:news-homepage:${currentLang}`,
    // );
    // if (cachedData) {
    //   return cachedData;
    // }

    const newsItems = await this.newsRepository
      .createQueryBuilder('news')
      .select([
        'news.id',
        'news.cover',
        `news.title_${currentLang}`,
        `news.description_${currentLang}`,
        'news.createdAt',
      ])
      .where('news.status = :status', { status: NewsStatus.ACTIVE })
      .orderBy('news.createdAt', 'DESC')
      .limit(50)
      .getMany();

    // Separate main news (latest) and other items
    const [mainNews, ...otherNews] = newsItems;

    const result = {
      main: {
        id: mainNews.id,
        cover: mainNews.cover,
        title: mainNews[`title_${currentLang}`],
        description: mainNews[`description_${currentLang}`],
        createdAt: mainNews.createdAt,
      },
      items: otherNews.map((item) => ({
        id: item.id,
        cover: item.cover,
        title: item[`title_${currentLang}`],
        createdAt: item.createdAt,
      })),
    };

    await this.redisService.set(`core:news-homepage:${currentLang}`, result);

    return result;
  }
}
