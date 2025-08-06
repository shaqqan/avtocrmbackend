import { BadRequestException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateAudioBookDto } from './dto/request/create-audio-book.dto';
import { UpdateAudioBookDto } from './dto/request/update-audio-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, In } from 'typeorm';
import { AudioBook, AudioBookLangEnum, Author, Genre, Issuer, File, BookAudiobookLink } from 'src/databases/typeorm/entities';
import { LinkStatusEnum } from '../../../databases/typeorm/entities/book-audiobook-link.entity';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { AudioBookMapper } from './mapper/audio-book.mapper';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { QueryAudioBookDto } from './dto/request/query-audio-book.dto';

@Injectable({ scope: Scope.REQUEST })
export class AudioBookService {
  constructor(
    @InjectRepository(AudioBook)
    private readonly audioBookRepository: Repository<AudioBook>,
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
  ) { }

  async create(createAudioBookDto: CreateAudioBookDto) {
    // Validate and fetch authors
    let authors: Author[] = [];
    if (createAudioBookDto.authorsIds && createAudioBookDto.authorsIds.length > 0) {
      authors = await this.authorRepository.findBy({ id: In(createAudioBookDto.authorsIds) });
      if (authors.length !== createAudioBookDto.authorsIds.length) {
        throw new BadRequestException(this.i18n.t('errors.AUDIOBOOK.INVALID_AUTHORS'));
      }
    }

    // Validate and fetch genres
    let genres: Genre[] = [];
    if (createAudioBookDto.genresIds && createAudioBookDto.genresIds.length > 0) {
      genres = await this.genreRepository.findBy({ id: In(createAudioBookDto.genresIds) });
      if (genres.length !== createAudioBookDto.genresIds.length) {
        throw new BadRequestException(this.i18n.t('errors.AUDIOBOOK.INVALID_GENRES'));
      }
    }

    // Validate and fetch issuers
    let issuers: Issuer[] = [];
    if (createAudioBookDto.issuersIds && createAudioBookDto.issuersIds.length > 0) {
      issuers = await this.issuerRepository.findBy({ id: In(createAudioBookDto.issuersIds) });
      if (issuers.length !== createAudioBookDto.issuersIds.length) {
        throw new BadRequestException(this.i18n.t('errors.AUDIOBOOK.INVALID_ISSUERS'));
      }
    }

    // Validate and fetch files
    let files: File[] = [];
    if (createAudioBookDto.filesIds && createAudioBookDto.filesIds.length > 0) {
      files = await this.fileRepository.findBy({ id: In(createAudioBookDto.filesIds) });
      if (files.length !== createAudioBookDto.filesIds.length) {
        throw new BadRequestException(this.i18n.t('errors.AUDIOBOOK.INVALID_FILES'));
      }
    }

    const audioBook = AudioBookMapper.toEntityFromCreateDto(createAudioBookDto);
    audioBook.authors = authors;
    audioBook.genres = genres;
    audioBook.issuers = issuers;
    audioBook.files = files;

    const savedAudioBook = await this.audioBookRepository.save(audioBook);

    // Fetch the saved audiobook with relations for response
    const audioBookWithRelations = await this.audioBookRepository.findOne({
      where: { id: savedAudioBook.id },
      relations: { authors: true, genres: true, issuers: true, files: true }
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUDIOBOOK.CREATED'),
      AudioBookMapper.toDto(audioBookWithRelations!)
    );
  }

  async findAll(query: QueryAudioBookDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';

    console.log(I18nContext.current()?.lang);

    const allowedSortFields: string[] = [
      'id',
      'name',
      'description_short',
      'lang',
      'ISBN',
      'duration',
      'top',
      'cover',
      'year',
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

    // Build where conditions array for OR logic in search
    const whereConditions: any[] = [];

    // Handle search with OR conditions
    if (search) {
      whereConditions.push(
        { [`name_${currentLocale}`]: ILike(`%${search}%`) },
        { [`description_${currentLocale}`]: ILike(`%${search}%`) },
        { [`description_short_${currentLocale}`]: ILike(`%${search}%`) }
      );
    }

    const [audioBooks, total] = await this.audioBookRepository.findAndCount({
      relations: {
        authors: true,
        files: true,
        genres: true,
        issuers: true,
      },
      select: {
        id: true,
        [`name_${currentLocale}`]: true,
        [`description_short_${currentLocale}`]: true,
        lang: true,
        ISBN: true,
        duration: true,
        top: true,
        cover: true,
        year: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [actualSortField]: sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(AudioBookMapper.toDtoList(audioBooks), {
      total,
      page,
      limit,
    });
  }

  public async findOne(id: number) {
    const audioBook = await this.audioBookRepository.findOne({
      relations: {
        authors: true,
        files: true,
        genres: true,
        issuers: true,
      },
      where: { id }
    });
    if (!audioBook) {
      throw new NotFoundException(this.i18n.t('errors.AUDIOBOOK.NOT_FOUND'));
    }
    return AudioBookMapper.toDto(audioBook);
  }

  async update(id: number, updateAudioBookDto: UpdateAudioBookDto) {
    const audioBook = await this.audioBookRepository.findOne({
      where: { id },
      relations: { authors: true, genres: true, issuers: true, files: true }
    });

    if (!audioBook) {
      throw new NotFoundException(this.i18n.t('errors.AUDIOBOOK.NOT_FOUND'));
    }

    let authors = audioBook.authors;
    let genres = audioBook.genres;
    let issuers = audioBook.issuers;
    let files = audioBook.files;

    // Update authors if provided
    if (updateAudioBookDto.authorsIds !== undefined) {
      if (updateAudioBookDto.authorsIds.length > 0) {
        authors = await this.authorRepository.findBy({ id: In(updateAudioBookDto.authorsIds) });
        if (authors.length !== updateAudioBookDto.authorsIds.length) {
          throw new BadRequestException(this.i18n.t('errors.AUDIOBOOK.INVALID_AUTHORS'));
        }
      } else {
        authors = [];
      }
    }

    // Update genres if provided
    if (updateAudioBookDto.genresIds !== undefined) {
      if (updateAudioBookDto.genresIds.length > 0) {
        genres = await this.genreRepository.findBy({ id: In(updateAudioBookDto.genresIds) });
        if (genres.length !== updateAudioBookDto.genresIds.length) {
          throw new BadRequestException(this.i18n.t('errors.AUDIOBOOK.INVALID_GENRES'));
        }
      } else {
        genres = [];
      }
    }

    // Update issuers if provided
    if (updateAudioBookDto.issuersIds !== undefined) {
      if (updateAudioBookDto.issuersIds.length > 0) {
        issuers = await this.issuerRepository.findBy({ id: In(updateAudioBookDto.issuersIds) });
        if (issuers.length !== updateAudioBookDto.issuersIds.length) {
          throw new BadRequestException(this.i18n.t('errors.AUDIOBOOK.INVALID_ISSUERS'));
        }
      } else {
        issuers = [];
      }
    }

    // Update files if provided
    if (updateAudioBookDto.filesIds !== undefined) {
      if (updateAudioBookDto.filesIds.length > 0) {
        files = await this.fileRepository.findBy({ id: In(updateAudioBookDto.filesIds) });
        if (files.length !== updateAudioBookDto.filesIds.length) {
          throw new BadRequestException(this.i18n.t('errors.AUDIOBOOK.INVALID_FILES'));
        }
      } else {
        files = [];
      }
    }

    const updatedAudioBookData = AudioBookMapper.toEntityFromUpdateDto(updateAudioBookDto, audioBook);
    updatedAudioBookData.authors = authors;
    updatedAudioBookData.genres = genres;
    updatedAudioBookData.issuers = issuers;
    updatedAudioBookData.files = files;

    const savedAudioBook = await this.audioBookRepository.save(updatedAudioBookData);

    // Fetch the updated audiobook with relations
    const audioBookWithRelations = await this.audioBookRepository.findOne({
      where: { id: savedAudioBook.id },
      relations: { authors: true, genres: true, issuers: true, files: true }
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUDIOBOOK.UPDATED'),
      AudioBookMapper.toDto(audioBookWithRelations!)
    );
  }

  async remove(id: number) {
    const audioBook = await this.audioBookRepository.findOne({ where: { id } });
    if (!audioBook) {
      throw new NotFoundException(this.i18n.t('errors.AUDIOBOOK.NOT_FOUND'));
    }
    await this.audioBookRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('success.AUDIOBOOK.DELETED'));
  }

  /**
   * Get all books linked to this audiobook
   */
  async getLinkedBooks(audiobookId: number) {
    const links = await this.bookAudiobookLinkRepository.find({
      where: {
        audiobookId,
        status: LinkStatusEnum.ACTIVE // Only get active links
      },
      relations: ['book'],
      order: { priority: 'ASC', createdAt: 'DESC' },
    });

    return links.map(link => ({
      linkId: link.id,
      linkType: link.linkType,
      priority: link.priority,
      book: {
        id: link.book.id,
        name_uz: link.book.name_uz,
        name_ru: link.book.name_ru,
        name_en: link.book.name_en,
        cover: link.book.cover,
        pages: link.book.pages,
        year: link.book.year,
        published: link.book.published,
      }
    }));
  }

  /**
   * Check if this audiobook has any linked books
   */
  async hasLinkedBooks(audiobookId: number): Promise<boolean> {
    const count = await this.bookAudiobookLinkRepository.count({
      where: {
        audiobookId,
        status: LinkStatusEnum.ACTIVE
      }
    });
    return count > 0;
  }
}
