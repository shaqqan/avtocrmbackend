import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/request/create-book.dto';
import { UpdateBookDto } from './dto/request/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Book, BookLangEnum } from 'src/databases/typeorm/entities';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { BookMapper } from './mapper/book.mapper';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { QueryBookDto } from './dto/request/query-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly i18n: I18nService,
  ) { }

  async create(createBookDto: CreateBookDto) {
    const book = BookMapper.toEntityFromCreateDto(createBookDto);
    const savedBook = await this.bookRepository.save(book);
    return new MessageWithDataResponseDto(this.i18n.t('messages.CREATED'), BookMapper.toDto(savedBook));
  }

  async findAll(query: QueryBookDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search, authorId, genreId, issuerId } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';

    const allowedSortFields: string[] = [
      'id',
      'name',
      'description',
      'description_short',
      'lang',
      'ISBN',
      'top',
      'cover',
      'year',
      'pages',
      'published',
      'createdAt',
      'updatedAt'
    ];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'));
    }

    const localizableFields = ['name', 'description', 'description_short'];
    const actualSortField = localizableFields.includes(sortBy)
      ? `${sortBy}_${currentLocale}`
      : sortBy;

    // Build where conditions array for OR/AND logic
    const whereConditions: any[] = [];

    // Handle search with OR conditions
    if (search) {
      const baseCondition: any = {};

      // Add relation filters to base condition
      if (authorId) {
        baseCondition.authors = { id: authorId };
      }
      if (genreId) {
        baseCondition.genres = { id: genreId };
      }
      if (issuerId) {
        baseCondition.issuers = { id: issuerId };
      }

      // Create search conditions with base filters
      whereConditions.push(
        {
          [`name_${currentLocale}`]: ILike(`%${search}%`),
          ...baseCondition,
        },
        {
          [`description_${currentLocale}`]: ILike(`%${search}%`),
          ...baseCondition,
        },
        {
          [`description_short_${currentLocale}`]: ILike(`%${search}%`),
          ...baseCondition,
        }
      );
    } else {
      // No search, just apply filters
      const condition: any = {};

      if (authorId) {
        condition.authors = { id: authorId };
      }
      if (genreId) {
        condition.genres = { id: genreId };
      }
      if (issuerId) {
        condition.issuers = { id: issuerId };
      }

      if (Object.keys(condition).length > 0) {
        whereConditions.push(condition);
      }
    }

    const [books, total] = await this.bookRepository.findAndCount({
      relations: {
        authors: true,
        files: true,
        genres: true,
        issuers: true,
      },
      select: {
        id: true,
        [`name_${currentLocale}`]: true,
        [`description_${currentLocale}`]: true,
        [`description_short_${currentLocale}`]: true,
        lang: true,
        ISBN: true,
        top: true,
        cover: true,
        year: true,
        pages: true,
        published: true,
        createdAt: true,
      },
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [actualSortField]: sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(BookMapper.toDtoList(books), {
      total,
      page,
      limit,
    });
  }

  public async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      relations: {
        authors: true,
        files: true,
        genres: true,
        issuers: true,
      },
      where: { id }
    });
    if (!book) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    return BookMapper.toDto(book);
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    const updatedBook = await this.bookRepository.save({
      ...book,
      ...BookMapper.toEntityFromUpdateDto(updateBookDto, book)
    });
    return new MessageWithDataResponseDto(this.i18n.t('messages.UPDATED'), BookMapper.toDto(updatedBook));
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    await this.bookRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('messages.DELETED'));
  }
}
