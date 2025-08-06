import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Book, PublishedEnum } from 'src/databases/typeorm/entities';
import { RedisService } from 'src/databases/redis/redis.service';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly redisService: RedisService,
  ) { }

  public async newBooks() {
    const currentLang = I18nContext.current()?.lang?.split('-')[0] || 'uz';
    const cachedData = await this.redisService.get(`core:new-books:${currentLang}`);
    if (cachedData) {
      return cachedData;
    }

    const books = await this.bookRepository.find({
      select: {
        id: true,
        [`name_${currentLang}`]: true,
        cover: true,
        createdAt: true,
        authors: {
          id: true,
          [`name_${currentLang}`]: true,
          [`lastName_${currentLang}`]: true,
          [`middleName_${currentLang}`]: true,
        },
        reviews: {
          rating: true,
        }
      },
      relations: {
        authors: true,
        reviews: true,
      },
      where: {
        published: PublishedEnum.PUBLISHED,
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
      take: 50,
    });

    const data = books.map(book => ({
      id: book.id,
      cover: book.cover,
      avgRating: book.getAvgRating(),
      name: book[`name_${currentLang}`],
      authors: book.authors.map(author => ({
        id: author.id,
        name: author[`name_${currentLang}`],
        lastName: author[`lastName_${currentLang}`],
        middleName: author[`middleName_${currentLang}`],
      })),
    }));

    await this.redisService.set(`core:new-books:${currentLang}`, data, 60 * 60 * 24);
    return data;
  }
}
