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
  ) {}

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
      .addSelect(
        `GROUP_CONCAT(DISTINCT author.name_${currentLang})`,
        'authorNames',
      )
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
      authors: book.authorNames
        ? book.authorNames.split(',').map(decodeHTML)
        : [],
    }));

    await this.redisService.set(`core:new-books:${currentLang}`, data);

    return data;
  }

  public async topBooksByRating() {
    const currentLang = currentLocale();
    const cachedData = await this.redisService.get(
      `core:top-books-rating:${currentLang}`,
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
      ])
      .addSelect('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .addSelect(
        `GROUP_CONCAT(DISTINCT author.name_${currentLang})`,
        'authorNames',
      )
      .where('book.published = :published', {
        published: PublishedEnum.PUBLISHED,
      })
      .andWhere('book.deletedAt IS NULL')
      .groupBy('book.id')
      .having('COUNT(review.id) >= 1') // Only books with at least 1 review
      .orderBy('averageRating', 'DESC')
      .addOrderBy('reviewCount', 'DESC')
      .limit(50)
      .getRawMany();

    const data = books.map((book) => ({
      id: book.book_id,
      cover: global.asset(book.book_cover),
      avgRating: parseFloat(book.averageRating) || 5.0,
      reviewCount: parseInt(book.reviewCount) || 0,
      name: decodeHTML(book[`book_name_${currentLang}`]),
      authors: book.authorNames
        ? book.authorNames.split(',').map(decodeHTML)
        : [],
    }));

    await this.redisService.set(`core:top-books-rating:${currentLang}`, data);

    return data;
  }

  public async topBooksOfWeek() {
    const currentLang = currentLocale();
    const cachedData = await this.redisService.get(
      `core:top-books-week:${currentLang}`,
    );
    if (cachedData) {
      return cachedData;
    }

    // Calculate the start of the current week (Monday)
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
    startOfWeek.setDate(now.getDate() - daysToSubtract);
    startOfWeek.setHours(0, 0, 0, 0);

    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.reviews', 'review')
      .leftJoin('book.authors', 'author')
      .select([
        'book.id',
        'book.cover',
        `book.name_${currentLang}`,
        'book.published',
      ])
      .addSelect('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .addSelect(
        `GROUP_CONCAT(DISTINCT author.name_${currentLang})`,
        'authorNames',
      )
      .where('book.published = :published', {
        published: PublishedEnum.PUBLISHED,
      })
      .andWhere('book.deletedAt IS NULL')
      .andWhere('review.createdAt >= :startOfWeek', { startOfWeek })
      .groupBy('book.id')
      .having('COUNT(review.id) >= 1') // Only books with at least 1 review this week
      .orderBy('averageRating', 'DESC')
      .addOrderBy('reviewCount', 'DESC')
      .limit(50)
      .getRawMany();

    const data = books.map((book) => ({
      id: book.book_id,
      cover: global.asset(book.book_cover),
      avgRating: parseFloat(book.averageRating) || 5.0,
      reviewCount: parseInt(book.reviewCount) || 0,
      name: decodeHTML(book[`book_name_${currentLang}`]),
      authors: book.authorNames
        ? book.authorNames.split(',').map(decodeHTML)
        : [],
    }));

    await this.redisService.set(
      `core:top-books-week:${currentLang}`,
      data,
      60 * 60 * 2, // 2 hours cache for weekly data
    );

    return data;
  }
}
