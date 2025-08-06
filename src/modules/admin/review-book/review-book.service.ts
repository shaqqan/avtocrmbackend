import { BadRequestException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateReviewBookDto } from './dto/request/create-review-book.dto';
import { UpdateReviewBookDto } from './dto/request/update-review-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ReviewBook, Book, User } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto, MessageWithDataResponseDto, MessageResponseDto } from 'src/common/dto/response';
import { ReviewMapper } from './mapper/review.mapper';

@Injectable({ scope: Scope.REQUEST })
export class ReviewBookService {
  constructor(
    @InjectRepository(ReviewBook)
    private readonly reviewBookRepository: Repository<ReviewBook>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) { }

  async create(createReviewBookDto: CreateReviewBookDto, user: User) {
    // Validate book exists
    const book = await this.bookRepository.findOne({
      where: { id: createReviewBookDto.booksId }
    });
    if (!book) {
      throw new BadRequestException(this.i18n.t('errors.REVIEW_BOOK.BOOK_NOT_FOUND'));
    }

    // Check for existing review from same email/ip for this book
    const existingReview = await this.reviewBookRepository.findOne({
      where: {
        booksId: createReviewBookDto.booksId,
        email: createReviewBookDto.email,
        ip: createReviewBookDto.ip
      }
    });

    if (existingReview) {
      throw new BadRequestException(this.i18n.t('errors.REVIEW_BOOK.ALREADY_REVIEWED'));
    }

    const reviewBook = await this.reviewBookRepository.save({
      ...ReviewMapper.toEntityFromCreateDto(createReviewBookDto),
      usersId: user.id,
    });

    // Fetch the created review with relations
    const reviewWithRelations = await this.reviewBookRepository.findOne({
      where: { id: reviewBook.id },
      relations: { user: true }
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.REVIEW_BOOK.CREATED'),
      ReviewMapper.toDto(reviewWithRelations!)
    );
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy = 'createdAt', sortOrder = 'DESC', search } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';

    const allowedSortFields = ['id', 'name', 'createdAt', 'updatedAt'];

    // Validate sortBy field
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const whereConditions: any[] = [];
    if (search) {
      whereConditions.push(
        { [`name`]: ILike(`%${search}%`) },
        { [`email`]: ILike(`%${search}%`) },
        { [`ip`]: ILike(`%${search}%`) },
        { [`rating`]: ILike(`%${search}%`) },
        { [`review`]: ILike(`%${search}%`) },
        { [`status`]: ILike(`%${search}%`) },
        { [`createdAt`]: ILike(`%${search}%`) },
      );
    }

    const [data, total] = await this.reviewBookRepository.findAndCount({
      relations: { user: true },
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [validSortBy]: sortOrder,
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(ReviewMapper.toDtoList(data), {
      total,
      page,
      limit,
    });
  }

  public async findOne(id: number) {
    const currentLocale = I18nContext.current()?.lang?.split('-')[0] || 'uz';
    const reviewBook = await this.reviewBookRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        ip: true,
        rating: true,
        review: true,
        status: true,
        createdAt: true,
        booksId: true,
        usersId: true,
        user: {
          id: true,
          name: true,
          lastName: true,
        },
        book: {
          id: true,
          [`name_${currentLocale}`]: true,
          [`description_short_${currentLocale}`]: true,
          cover: true,
        }
      },
      where: { id },
      relations: { user: true, book: true }
    });

    if (!reviewBook) {
      throw new NotFoundException(this.i18n.t('errors.REVIEW_BOOK.NOT_FOUND'));
    }

    return ReviewMapper.toDto(reviewBook);
  }

  async update(id: number, updateReviewBookDto: UpdateReviewBookDto, user: User) {
    const reviewBook = await this.reviewBookRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!reviewBook) {
      throw new NotFoundException(this.i18n.t('errors.REVIEW_BOOK.NOT_FOUND'));
    }

    // Validate book exists if booksId is being updated
    if (updateReviewBookDto.booksId && updateReviewBookDto.booksId !== reviewBook.booksId) {
      const book = await this.bookRepository.findOne({
        where: { id: updateReviewBookDto.booksId }
      });
      if (!book) {
        throw new BadRequestException(this.i18n.t('errors.REVIEW_BOOK.BOOK_NOT_FOUND'));
      }
    }

    await this.reviewBookRepository.update(id, {
      ...ReviewMapper.toEntityFromUpdateDto(updateReviewBookDto, reviewBook),
      usersId: user.id,
    });

    // Fetch updated review with relations
    const reviewWithRelations = await this.reviewBookRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.REVIEW_BOOK.UPDATED'),
      ReviewMapper.toDto(reviewWithRelations!)
    );
  }

  async remove(id: number) {
    const reviewBook = await this.reviewBookRepository.findOne({ where: { id } });

    if (!reviewBook) {
      throw new NotFoundException(this.i18n.t('errors.REVIEW_BOOK.NOT_FOUND'));
    }

    await this.reviewBookRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('success.REVIEW_BOOK.DELETED'));
  }
}
