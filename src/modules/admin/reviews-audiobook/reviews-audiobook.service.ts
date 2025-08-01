import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewsAudiobookDto } from './dto/request/create-reviews-audiobook.dto';
import { UpdateReviewsAudiobookDto } from './dto/request/update-reviews-audiobook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ReviewsAudiobook, AudioBook, User } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto, MessageWithDataResponseDto, MessageResponseDto } from 'src/common/dto/response';
import { ReviewsAudiobookMapper } from './mapper/reviews-audiobook.mapper';

@Injectable()
export class ReviewsAudiobookService {
  constructor(
    @InjectRepository(ReviewsAudiobook)
    private readonly reviewsAudiobookRepository: Repository<ReviewsAudiobook>,
    @InjectRepository(AudioBook)
    private readonly audioBookRepository: Repository<AudioBook>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) { }

  async create(createReviewsAudiobookDto: CreateReviewsAudiobookDto) {
    // Validate audiobook exists
    const audiobook = await this.audioBookRepository.findOne({
      where: { id: createReviewsAudiobookDto.audiobooksId }
    });
    if (!audiobook) {
      throw new BadRequestException(this.i18n.t('errors.REVIEWS_AUDIOBOOK.AUDIOBOOK_NOT_FOUND'));
    }

    // Validate user exists if usersId is provided
    if (createReviewsAudiobookDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: createReviewsAudiobookDto.userId }
      });
      if (!user) {
        throw new BadRequestException(this.i18n.t('errors.REVIEWS_AUDIOBOOK.USER_NOT_FOUND'));
      }
    }

    // Check for existing review from same email/ip for this audiobook
    const existingReview = await this.reviewsAudiobookRepository.findOne({
      where: {
        audiobooksId: createReviewsAudiobookDto.audiobooksId,
        email: createReviewsAudiobookDto.email,
        ip: createReviewsAudiobookDto.ip
      }
    });

    if (existingReview) {
      throw new BadRequestException(this.i18n.t('errors.REVIEWS_AUDIOBOOK.ALREADY_REVIEWED'));
    }

    const reviewsAudiobook = await this.reviewsAudiobookRepository.save(
      ReviewsAudiobookMapper.toEntityFromCreateDto(createReviewsAudiobookDto)
    );

    // Fetch the created review with relations
    const reviewWithRelations = await this.reviewsAudiobookRepository.findOne({
      where: { id: reviewsAudiobook.id },
      relations: { user: true }
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.REVIEWS_AUDIOBOOK.CREATED'),
      ReviewsAudiobookMapper.toDto(reviewWithRelations!)
    );
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy = 'createdAt', sortOrder = 'DESC', search } = query;
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

    const [data, total] = await this.reviewsAudiobookRepository.findAndCount({
      relations: { user: true },
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [validSortBy]: sortOrder,
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(ReviewsAudiobookMapper.toDtoList(data), {
      total,
      page,
      limit,
    });
  }

  public async findOne(id: number) {
    const currentLocale = I18nContext.current()?.lang?.split('-')[0] || 'uz';
    const reviewsAudiobook = await this.reviewsAudiobookRepository.findOne({
      select: {
        user: {
          id: true,
          name: true,
          lastName: true,
        },
        audiobook: {
          id: true,
          [`name_${currentLocale}`]: true,
          [`description_short_${currentLocale}`]: true,
          cover: true,
        }
      },
      relations: {
        user: true,
        audiobook: true
      },
      where: { id },
    });

    if (!reviewsAudiobook) {
      throw new NotFoundException(this.i18n.t('errors.REVIEWS_AUDIOBOOK.NOT_FOUND'));
    }

    return ReviewsAudiobookMapper.toDto(reviewsAudiobook);
  }

  async update(id: number, updateReviewsAudiobookDto: UpdateReviewsAudiobookDto) {
    const reviewsAudiobook = await this.reviewsAudiobookRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!reviewsAudiobook) {
      throw new NotFoundException(this.i18n.t('errors.REVIEWS_AUDIOBOOK.NOT_FOUND'));
    }

    // Validate audiobook exists if audiobooksId is being updated
    if (updateReviewsAudiobookDto.audiobooksId && updateReviewsAudiobookDto.audiobooksId !== reviewsAudiobook.audiobooksId) {
      const audiobook = await this.audioBookRepository.findOne({
        where: { id: updateReviewsAudiobookDto.audiobooksId }
      });
      if (!audiobook) {
        throw new BadRequestException(this.i18n.t('errors.REVIEWS_AUDIOBOOK.AUDIOBOOK_NOT_FOUND'));
      }
    }

    // Validate user exists if usersId is being updated
    if (updateReviewsAudiobookDto.userId !== undefined && updateReviewsAudiobookDto.userId !== reviewsAudiobook.userId) {
      if (updateReviewsAudiobookDto.userId) {
        const user = await this.userRepository.findOne({
          where: { id: updateReviewsAudiobookDto.userId }
        });
        if (!user) {
          throw new BadRequestException(this.i18n.t('errors.REVIEWS_AUDIOBOOK.USER_NOT_FOUND'));
        }
      }
    }

    const updatedReview = await this.reviewsAudiobookRepository.save({
      ...reviewsAudiobook,
      ...ReviewsAudiobookMapper.toEntityFromUpdateDto(updateReviewsAudiobookDto, reviewsAudiobook)
    });

    // Fetch updated review with relations
    const reviewWithRelations = await this.reviewsAudiobookRepository.findOne({
      where: { id: updatedReview.id },
      relations: { user: true }
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.REVIEWS_AUDIOBOOK.UPDATED'),
      ReviewsAudiobookMapper.toDto(reviewWithRelations!)
    );
  }

  async remove(id: number) {
    const reviewsAudiobook = await this.reviewsAudiobookRepository.findOne({ where: { id } });

    if (!reviewsAudiobook) {
      throw new NotFoundException(this.i18n.t('errors.REVIEWS_AUDIOBOOK.NOT_FOUND'));
    }

    await this.reviewsAudiobookRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('success.REVIEWS_AUDIOBOOK.DELETED'));
  }
}
