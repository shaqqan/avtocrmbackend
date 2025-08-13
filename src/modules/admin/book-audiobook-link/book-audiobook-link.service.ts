import {
  Injectable,
  ConflictException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { BookAudiobookLink } from '../../../databases/typeorm/entities/book-audiobook-link.entity';
import { Book } from '../../../databases/typeorm/entities/book.entity';
import { AudioBook } from '../../../databases/typeorm/entities/audio-book.entity';
import { CreateBookAudiobookLinkDto } from './dto/request/create-book-audiobook-link.dto';
import { UpdateBookAudiobookLinkDto } from './dto/request/update-book-audiobook-link.dto';
import { QueryBookAudiobookLinkDto } from './dto/request/query-book-audiobook-link.dto';
import { BookAudiobookLinkMapper } from './mapper/book-audiobook-link.mapper';
import {
  BookAudiobookLinkResponseDto,
  BookAudiobookLinkSummaryDto,
} from './dto/response/book-audiobook-link.res.dto';
import { MessageWithDataResponseDto } from '../../../common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from '../../../common/dto/response/message.res.dto';
import { BasePaginationResponseDto } from '../../../common/dto/response/base-pagination.res.dto';
import { currentLocale } from 'src/common/utils/i18n-contex';

@Injectable({ scope: Scope.REQUEST })
export class BookAudiobookLinkService {
  constructor(
    @InjectRepository(BookAudiobookLink)
    private readonly linkRepository: Repository<BookAudiobookLink>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(AudioBook)
    private readonly audiobookRepository: Repository<AudioBook>,
    private readonly i18n: I18nService,
  ) { }

  async create(
    createLinkDto: CreateBookAudiobookLinkDto,
  ): Promise<MessageWithDataResponseDto<BookAudiobookLinkResponseDto>> {
    // Check if link already exists
    const existingLink = await this.linkRepository.findOne({
      where: {
        bookId: createLinkDto.bookId,
        audiobookId: createLinkDto.audiobookId,
      },
    });

    if (existingLink) {
      throw new ConflictException(
        await this.i18n.translate('errors.BOOK_AUDIOBOOK_LINK.ALREADY_EXISTS'),
      );
    }

    // Verify that book and audiobook exist
    const book = await this.bookRepository.findOne({
      where: { id: createLinkDto.bookId },
    });
    if (!book) {
      throw new NotFoundException(
        await this.i18n.translate('errors.BOOK.NOT_FOUND'),
      );
    }

    const audiobook = await this.audiobookRepository.findOne({
      where: { id: createLinkDto.audiobookId },
    });
    if (!audiobook) {
      throw new NotFoundException(
        await this.i18n.translate('errors.AUDIOBOOK.NOT_FOUND'),
      );
    }

    const linkEntity =
      BookAudiobookLinkMapper.toEntityFromCreateDto(createLinkDto);
    const savedLink = await this.linkRepository.save(linkEntity);

    // Fetch the complete link with relations
    const completeLink = await this.findOneEntity(savedLink.id);
    const linkDto = BookAudiobookLinkMapper.toDto(completeLink);

    return {
      message: await this.i18n.translate('success.BOOK_AUDIOBOOK_LINK.CREATED'),
      data: linkDto,
    };
  }

  async findAll(
    query: QueryBookAudiobookLinkDto,
  ): Promise<BasePaginationResponseDto<BookAudiobookLinkResponseDto>> {
    const {
      take = 10,
      skip = 0,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      bookId,
      audiobookId,
      linkType,
      status,
    } = query;

    const locale = currentLocale();

    const queryBuilder = this.linkRepository
      .createQueryBuilder('link')
      .leftJoinAndSelect('link.book', 'book')
      .leftJoinAndSelect('link.audiobook', 'audiobook');

    // Apply filters
    if (bookId) {
      queryBuilder.andWhere('link.bookId = :bookId', { bookId });
    }

    if (audiobookId) {
      queryBuilder.andWhere('link.audiobookId = :audiobookId', { audiobookId });
    }

    if (linkType) {
      queryBuilder.andWhere('link.linkType = :linkType', { linkType });
    }

    if (status) {
      queryBuilder.andWhere('link.status = :status', { status });
    }

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(link.id = :searchId OR book.name_' + locale + ' LIKE :searchPattern OR audiobook.name_' + locale + ' LIKE :searchPattern OR link.linkType = :search OR link.status = :search OR CAST(link.priority AS CHAR) = :search)',
        {
          searchId: isNaN(Number(search)) ? -1 : Number(search), // For ID search
          searchPattern: `%${search}%`, // For name search
          search: search // For other fields
        }
      );
    }

    // Apply sorting
    const allowedSortFields = [
      'id',
      'createdAt',
      'updatedAt',
      'priority',
      'linkType',
      'status',
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const normalizedSortOrder =
      sortOrder?.toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`link.${sortField}`, normalizedSortOrder);
    queryBuilder.addOrderBy('link.priority', 'ASC'); // Secondary sort by priority

    // Apply pagination
    queryBuilder.skip(skip).take(take);

    const [entities, total] = await queryBuilder.getManyAndCount();
    const data = BookAudiobookLinkMapper.toDtoList(entities);

    return new BasePaginationResponseDto(data, {
      total,
      page,
      limit,
    });
  }
  
  async findOne(id: number): Promise<BookAudiobookLinkResponseDto> {
    const link = await this.findOneEntity(id);
    return BookAudiobookLinkMapper.toDto(link);
  }

  async update(
    id: number,
    updateLinkDto: UpdateBookAudiobookLinkDto,
  ): Promise<MessageWithDataResponseDto<BookAudiobookLinkResponseDto>> {
    const existingLink = await this.findOneEntity(id);

    // If updating book or audiobook IDs, check for conflicts
    if (updateLinkDto.bookId || updateLinkDto.audiobookId) {
      const newBookId = updateLinkDto.bookId || existingLink.bookId;
      const newAudiobookId =
        updateLinkDto.audiobookId || existingLink.audiobookId;

      const conflictingLink = await this.linkRepository.findOne({
        where: {
          bookId: newBookId,
          audiobookId: newAudiobookId,
        },
      });

      if (conflictingLink && conflictingLink.id !== id) {
        throw new ConflictException(
          await this.i18n.translate(
            'errors.BOOK_AUDIOBOOK_LINK.ALREADY_EXISTS',
          ),
        );
      }

      // Verify new book exists if being updated
      if (updateLinkDto.bookId) {
        const book = await this.bookRepository.findOne({
          where: { id: updateLinkDto.bookId },
        });
        if (!book) {
          throw new NotFoundException(
            await this.i18n.translate('errors.BOOK.NOT_FOUND'),
          );
        }
      }

      // Verify new audiobook exists if being updated
      if (updateLinkDto.audiobookId) {
        const audiobook = await this.audiobookRepository.findOne({
          where: { id: updateLinkDto.audiobookId },
        });
        if (!audiobook) {
          throw new NotFoundException(
            await this.i18n.translate('errors.AUDIOBOOK.NOT_FOUND'),
          );
        }
      }
    }

    // Save the updated entity
    const savedLink = await this.linkRepository.update(id, updateLinkDto);

    // Fetch the complete link with relations for response
    const completeLink = await this.linkRepository.findOne({
      where: { id: id },
      relations: ['book', 'audiobook'],
    });

    if (!completeLink) {
      throw new NotFoundException(
        await this.i18n.translate('errors.BOOK_AUDIOBOOK_LINK.NOT_FOUND'),
      );
    }

    const linkDto = BookAudiobookLinkMapper.toDto(completeLink);

    return {
      message: await this.i18n.translate('success.BOOK_AUDIOBOOK_LINK.UPDATED'),
      data: linkDto,
    };
  }

  async remove(id: number): Promise<MessageResponseDto> {
    const link = await this.findOneEntity(id);
    await this.linkRepository.remove(link);

    return {
      message: await this.i18n.translate('success.BOOK_AUDIOBOOK_LINK.DELETED'),
    };
  }

  async findLinksByBookId(
    bookId: number,
  ): Promise<BookAudiobookLinkSummaryDto[]> {
    const links = await this.linkRepository.find({
      where: { bookId },
      relations: ['audiobook'],
      order: { priority: 'ASC', createdAt: 'DESC' },
    });

    return BookAudiobookLinkMapper.toSummaryDtoList(links);
  }

  async findLinksByAudiobookId(
    audiobookId: number,
  ): Promise<BookAudiobookLinkSummaryDto[]> {
    const links = await this.linkRepository.find({
      where: { audiobookId },
      relations: ['book'],
      order: { priority: 'ASC', createdAt: 'DESC' },
    });

    return BookAudiobookLinkMapper.toSummaryDtoList(links);
  }

  private async findOneEntity(id: number): Promise<BookAudiobookLink> {
    const link = await this.linkRepository.findOne({
      where: { id },
      relations: ['book', 'audiobook'],
    });

    if (!link) {
      throw new NotFoundException(
        await this.i18n.translate('errors.BOOK_AUDIOBOOK_LINK.NOT_FOUND'),
      );
    }

    return link;
  }
}
