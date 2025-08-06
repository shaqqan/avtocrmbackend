import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Book, PublishedEnum } from 'src/databases/typeorm/entities';
import { RedisService } from 'src/databases/redis/redis.service';
import { currentLocale } from 'src/common/utils';
import { decodeHTML } from 'entities';

@Injectable({ scope: Scope.DEFAULT })
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly redisService: RedisService,
  ) { }

  public async newBooks() {
    const currentLang = currentLocale();
    const cachedData = await this.redisService.get(
      `core:new-books:${currentLang}`,
    );
    if (cachedData) {
      return cachedData;
    }

    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.reviews', 'review')
      .leftJoin('book.authors', 'author')
      .select([
        'book.id',
        'book.cover',
        `book.name_${currentLang}`,
        'book.published',
        'book.createdAt',
      ])
      .addSelect('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .addSelect(`GROUP_CONCAT(DISTINCT author.name_${currentLang})`, 'authorNames')
      .where('book.published = :published', {
        published: PublishedEnum.PUBLISHED,
      })
      .groupBy('book.id')
      .orderBy('book.createdAt', 'DESC')
      .addOrderBy('reviewCount', 'DESC')
      .limit(50)
      .getRawMany();

    const data = books.map((book) => ({
      id: book.book_id,
      cover: global.asset(book.book_cover),
      avgRating: parseFloat(book.averageRating) || 5.0,
      reviewCount: parseInt(book.reviewCount) || 0,
      name: decodeHTML(book[`book_name_${currentLang}`]),
      authors: book.authorNames ? book.authorNames.split(',').map(decodeHTML) : [],
    }));

    await this.redisService.set(
      `core:new-books:${currentLang}`,
      data,
    );

    return data;
  }
}
