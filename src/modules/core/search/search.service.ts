import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Brackets } from 'typeorm';
import {
  Book,
  AudioBook,
  Author,
  PublishedEnum,
  AudioBookPublishedEnum,
} from 'src/databases/typeorm/entities';
import { RedisService } from 'src/databases/redis/redis.service';
import { currentLocale } from 'src/common/utils';
import { decodeHTML } from 'entities';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(AudioBook)
    private readonly audioBookRepository: Repository<AudioBook>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  public async search(query: string) {
    const currentLang = currentLocale();
    const searchQuery = query.trim();

    if (!searchQuery) {
      return {
        books: [],
        audiobooks: [],
        authors: [],
      };
    }

    const books = await this.searchBooks(searchQuery, currentLang);
    const audiobooks = await this.searchAudiobooks(searchQuery, currentLang);
    const authors = await this.searchAuthors(searchQuery, currentLang);

    const result = {
      books,
      audiobooks,
      authors,
    };

    return result;
  }

  private async searchBooks(query: string, lang: string) {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.reviews', 'review')
      .leftJoin('book.authors', 'author')
      .select([
        'book.id',
        'book.cover',
        `book.name_${lang}`,
        'book.published',
        'book.createdAt',
      ])
      .addSelect('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .addSelect(`GROUP_CONCAT(DISTINCT author.name_${lang})`, 'authorNames')
      .where('book.published = :published', {
        published: PublishedEnum.PUBLISHED,
      })
      .andWhere(`book.name_${lang} LIKE :query`, { query: `%${query}%` })
      .groupBy('book.id')
      .orderBy('book.createdAt', 'DESC')
      .addOrderBy('reviewCount', 'DESC')
      .limit(50)
      .getRawMany();

    return books.map((book) => ({
      id: book.book_id,
      cover: global.asset(book.book_cover),
      avgRating: parseFloat(book.averageRating) || 5.0,
      reviewCount: parseInt(book.reviewCount) || 0,
      name: decodeHTML(book[`book_name_${lang}`]),
      authors: book.authorNames
        ? book.authorNames.split(',').map(decodeHTML)
        : [],
    }));
  }

  private async searchAudiobooks(query: string, lang: string) {
    const audiobooks = await this.audioBookRepository
      .createQueryBuilder('audiobook')
      .leftJoin('audiobook.reviews', 'review')
      .leftJoin('audiobook.authors', 'author')
      .select([
        'audiobook.id',
        'audiobook.cover',
        `audiobook.name_${lang}`,
        'audiobook.published',
        'audiobook.createdAt',
      ])
      .addSelect('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .addSelect(`GROUP_CONCAT(DISTINCT author.name_${lang})`, 'authorNames')
      .where('audiobook.published = :published', {
        published: AudioBookPublishedEnum.PUBLISHED,
      })
      .andWhere(`audiobook.name_${lang} LIKE :query`, { query: `%${query}%` })
      .groupBy('audiobook.id')
      .orderBy('audiobook.createdAt', 'DESC')
      .addOrderBy('reviewCount', 'DESC')
      .limit(50)
      .getRawMany();

    return audiobooks.map((audiobook) => ({
      id: audiobook.audiobook_id,
      cover: global.asset(audiobook.audiobook_cover),
      avgRating: parseFloat(audiobook.averageRating) || 5.0,
      reviewCount: parseInt(audiobook.reviewCount) || 0,
      name: decodeHTML(audiobook[`audiobook_name_${lang}`]),
      duration: audiobook.audiobook_duration,
      authors: audiobook.authorNames
        ? audiobook.authorNames.split(',').map(decodeHTML)
        : [],
    }));
  }

  private async searchAuthors(query: string, lang: string) {
    const authors = await this.authorRepository
      .createQueryBuilder('author')
      .leftJoin('author.books', 'book')
      .select([
        'author.id',
        `author.name_${lang}`,
        `author.lastName_${lang}`,
        `author.middleName_${lang}`,
        'author.cover',
      ])
      .addSelect('COUNT(book.id)', 'booksCount')
      .where(`author.name_${lang} LIKE :query`, { query: `%${query}%` })
      .orWhere(`author.lastName_${lang} LIKE :query`, { query: `%${query}%` })
      .orWhere(`author.middleName_${lang} LIKE :query`, { query: `%${query}%` })
      .groupBy('author.id')
      .orderBy('booksCount', 'DESC')
      .limit(50)
      .getRawMany();

    return authors.map((author) => ({
      id: author.author_id,
      name: decodeHTML(author[`author_name_${lang}`]),
      cover: global.asset(author.author_cover),
      lastName: decodeHTML(author[`author_lastName_${lang}`]),
      middleName: decodeHTML(author[`author_middleName_${lang}`]),
      bookCount: parseInt(author.bookCount) || 0,
    }));
  }
}
