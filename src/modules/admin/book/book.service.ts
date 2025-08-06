import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreateBookDto } from './dto/request/create-book.dto';
import { UpdateBookDto } from './dto/request/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, In } from 'typeorm';
import {
  Book,
  BookLangEnum,
  Author,
  Genre,
  Issuer,
  File,
  BookAudiobookLink,
} from 'src/databases/typeorm/entities';
import { LinkStatusEnum } from '../../../databases/typeorm/entities/book-audiobook-link.entity';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { BookMapper } from './mapper/book.mapper';
import {
  BasePaginationResponseDto,
  MessageResponseDto,
  MessageWithDataResponseDto,
} from 'src/common/dto/response';
import { QueryBookDto } from './dto/request/query-book.dto';
import { currentLocale } from 'src/common/utils';

@Injectable({ scope: Scope.REQUEST })
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Issuer)
    private readonly issuerRepository: Repository<Issuer>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(BookAudiobookLink)
    private readonly bookAudiobookLinkRepository: Repository<BookAudiobookLink>,
    private readonly i18n: I18nService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    // Validate and fetch authors
    let authors: Author[] = [];
    if (createBookDto.authorsIds && createBookDto.authorsIds.length > 0) {
      authors = await this.authorRepository.findBy({
        id: In(createBookDto.authorsIds),
      });
      if (authors.length !== createBookDto.authorsIds.length) {
        throw new BadRequestException(
          this.i18n.t('errors.BOOK.INVALID_AUTHORS'),
        );
      }
    }

    // Validate and fetch genres
    let genres: Genre[] = [];
    if (createBookDto.genresIds && createBookDto.genresIds.length > 0) {
      genres = await this.genreRepository.findBy({
        id: In(createBookDto.genresIds),
      });
      if (genres.length !== createBookDto.genresIds.length) {
        throw new BadRequestException(
          this.i18n.t('errors.BOOK.INVALID_GENRES'),
        );
      }
    }

    // Validate and fetch issuers
    let issuers: Issuer[] = [];
    if (createBookDto.issuersIds && createBookDto.issuersIds.length > 0) {
      issuers = await this.issuerRepository.findBy({
        id: In(createBookDto.issuersIds),
      });
      if (issuers.length !== createBookDto.issuersIds.length) {
        throw new BadRequestException(
          this.i18n.t('errors.BOOK.INVALID_ISSUERS'),
        );
      }
    }

    // Validate and fetch files
    let files: File[] = [];
    if (createBookDto.filesIds && createBookDto.filesIds.length > 0) {
      files = await this.fileRepository.findBy({
        id: In(createBookDto.filesIds),
      });
      if (files.length !== createBookDto.filesIds.length) {
        throw new BadRequestException(this.i18n.t('errors.BOOK.INVALID_FILES'));
      }
    }

    const book = BookMapper.toEntityFromCreateDto(createBookDto);
    book.authors = authors;
    book.genres = genres;
    book.issuers = issuers;
    book.files = files;

    const savedBook = await this.bookRepository.save(book);

    // Fetch the saved book with relations for response
    const bookWithRelations = await this.bookRepository.findOne({
      where: { id: savedBook.id },
      relations: { authors: true, genres: true, issuers: true, files: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.BOOK.CREATED'),
      BookMapper.toDto(bookWithRelations!),
    );
  }

  async findAll(query: QueryBookDto) {
    const {
      take,
      skip,
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      authorId,
      genreId,
      issuerId,
    } = query;
    const currentLang = currentLocale();

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
      'updatedAt',
    ];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'),
      );
    }

    const localizableFields = ['name', 'description', 'description_short'];
    const actualSortField = localizableFields.includes(sortBy)
      ? `${sortBy}_${currentLang}`
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
          [`name_${currentLang}`]: ILike(`%${search}%`),
          ...baseCondition,
        },
        {
          [`description_${currentLang}`]: ILike(`%${search}%`),
          ...baseCondition,
        },
        {
          [`description_short_${currentLang}`]: ILike(`%${search}%`),
          ...baseCondition,
        },
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
        [`name_${currentLang}`]: true,
        [`description_${currentLang}`]: true,
        [`description_short_${currentLang}`]: true,
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
      where: { id },
    });
    if (!book) {
      throw new NotFoundException(this.i18n.t('errors.BOOK.NOT_FOUND'));
    }
    return BookMapper.toDto(book);
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: { authors: true, genres: true, issuers: true, files: true },
    });

    if (!book) {
      throw new NotFoundException(this.i18n.t('errors.BOOK.NOT_FOUND'));
    }

    let authors = book.authors;
    let genres = book.genres;
    let issuers = book.issuers;
    let files = book.files;

    // Update authors if provided
    if (updateBookDto.authorsIds !== undefined) {
      if (updateBookDto.authorsIds.length > 0) {
        authors = await this.authorRepository.findBy({
          id: In(updateBookDto.authorsIds),
        });
        if (authors.length !== updateBookDto.authorsIds.length) {
          throw new BadRequestException(
            this.i18n.t('errors.BOOK.INVALID_AUTHORS'),
          );
        }
      } else {
        authors = [];
      }
    }

    // Update genres if provided
    if (updateBookDto.genresIds !== undefined) {
      if (updateBookDto.genresIds.length > 0) {
        genres = await this.genreRepository.findBy({
          id: In(updateBookDto.genresIds),
        });
        if (genres.length !== updateBookDto.genresIds.length) {
          throw new BadRequestException(
            this.i18n.t('errors.BOOK.INVALID_GENRES'),
          );
        }
      } else {
        genres = [];
      }
    }

    // Update issuers if provided
    if (updateBookDto.issuersIds !== undefined) {
      if (updateBookDto.issuersIds.length > 0) {
        issuers = await this.issuerRepository.findBy({
          id: In(updateBookDto.issuersIds),
        });
        if (issuers.length !== updateBookDto.issuersIds.length) {
          throw new BadRequestException(
            this.i18n.t('errors.BOOK.INVALID_ISSUERS'),
          );
        }
      } else {
        issuers = [];
      }
    }

    // Update files if provided
    if (updateBookDto.filesIds !== undefined) {
      if (updateBookDto.filesIds.length > 0) {
        files = await this.fileRepository.findBy({
          id: In(updateBookDto.filesIds),
        });
        if (files.length !== updateBookDto.filesIds.length) {
          throw new BadRequestException(
            this.i18n.t('errors.BOOK.INVALID_FILES'),
          );
        }
      } else {
        files = [];
      }
    }

    const updatedBookData = BookMapper.toEntityFromUpdateDto(
      updateBookDto,
      book,
    );
    updatedBookData.authors = authors;
    updatedBookData.genres = genres;
    updatedBookData.issuers = issuers;
    updatedBookData.files = files;

    const savedBook = await this.bookRepository.save(updatedBookData);

    // Fetch the updated book with relations
    const bookWithRelations = await this.bookRepository.findOne({
      where: { id: savedBook.id },
      relations: { authors: true, genres: true, issuers: true, files: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.BOOK.UPDATED'),
      BookMapper.toDto(bookWithRelations!),
    );
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(this.i18n.t('errors.BOOK.NOT_FOUND'));
    }
    await this.bookRepository.softDelete(id);
    return new MessageResponseDto(this.i18n.t('success.BOOK.DELETED'));
  }

  /**
   * Get all audiobooks linked to this book
   */
  async getLinkedAudiobooks(bookId: number) {
    const links = await this.bookAudiobookLinkRepository.find({
      where: {
        bookId,
        status: LinkStatusEnum.ACTIVE, // Only get active links
      },
      relations: ['audiobook'],
      order: { priority: 'ASC', createdAt: 'DESC' },
    });

    return links.map((link) => ({
      linkId: link.id,
      linkType: link.linkType,
      priority: link.priority,
      audiobook: {
        id: link.audiobook.id,
        name_uz: link.audiobook.name_uz,
        name_ru: link.audiobook.name_ru,
        name_en: link.audiobook.name_en,
        cover: link.audiobook.cover,
        duration: link.audiobook.duration,
        year: link.audiobook.year,
        published: link.audiobook.published,
      },
    }));
  }

  /**
   * Check if this book has any linked audiobooks
   */
  async hasLinkedAudiobooks(bookId: number): Promise<boolean> {
    const count = await this.bookAudiobookLinkRepository.count({
      where: {
        bookId,
        status: LinkStatusEnum.ACTIVE,
      },
    });
    return count > 0;
  }
}
