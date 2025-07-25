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

  async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search } = query;
    const allowedSortFields: string[] = ['id', 'name_uz', 'description_uz', 'description_short_uz', 'lang', 'ISBN', 'top', 'cover', 'year', 'pages', 'published', 'createdAt', 'updatedAt'];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'));
    }

    const [books, total] = await this.bookRepository.findAndCount({
      select: {
        id: true,
        [`name_uz`]: true,
        [`description_uz`]: true,
        [`description_short_uz`]: true,
        lang: true,
        ISBN: true,
        top: true,
        cover: true,
        year: true,
        pages: true,
        published: true,
      },
      where: search ? [
        { [`name_uz`]: ILike(`%${search}%`) },
        { [`description_uz`]: ILike(`%${search}%`) },
        { [`description_short_uz`]: ILike(`%${search}%`) },
      ] : undefined,
      order: {
        [sortBy]: sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(BookMapper.toDtoList(books, BookLangEnum.UZ), {
      total,
      page,
      limit,
    });
  }
  public async findOne(id: number) {
    const currentLocale = I18nContext.current()?.lang;
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    return BookMapper.toDto(book, currentLocale);
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
