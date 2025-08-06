import { BadRequestException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateFeedbacksThemeDto } from './dto/request/create-feedbacks-theme.dto';
import { UpdateFeedbacksThemeDto } from './dto/request/update-feedbacks-theme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FeedbacksTheme } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto, MessageWithDataResponseDto, MessageResponseDto } from 'src/common/dto/response';
import { FeedbacksThemeMapper } from './mapper/feedbacks-theme.mapper';

@Injectable({ scope: Scope.REQUEST })
export class FeedbacksThemeService {
  constructor(
    @InjectRepository(FeedbacksTheme)
    private feedbacksThemeRepository: Repository<FeedbacksTheme>,
    private readonly i18n: I18nService,
  ) { }

  async create(createFeedbacksThemeDto: CreateFeedbacksThemeDto) {
    const feedbacksTheme = await this.feedbacksThemeRepository.save(
      FeedbacksThemeMapper.toEntityFromCreateDto(createFeedbacksThemeDto)
    );

    return new MessageWithDataResponseDto(
      this.i18n.t('success.FEEDBACKS_THEME.CREATED'),
      FeedbacksThemeMapper.toDto(feedbacksTheme)
    );
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy = 'createdAt', sortOrder = 'DESC', search } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';

    const allowedSortFields = ['id', 'name', 'createdAt', 'updatedAt'];

    // Validate sortBy field
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // Handle localized sort fields
    const localizableFields = ['name'];
    const actualSortField = localizableFields.includes(validSortBy)
      ? `${validSortBy}_${currentLocale}`
      : validSortBy;

    // Validate sortOrder
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder?.toUpperCase())
      ? sortOrder.toUpperCase() as 'ASC' | 'DESC'
      : 'DESC';


    // Build where conditions for search
    const whereConditions: any[] = [];
    if (search) {
      whereConditions.push(
        { [`name_${currentLocale}`]: ILike(`%${search}%`) }
      );
    }

    const [feedbacksThemes, total] = await this.feedbacksThemeRepository.findAndCount({
      select: {
        id: true,
        [`name_${currentLocale}`]: true,
        createdAt: true,
        updatedAt: true,
      },
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [actualSortField]: validSortOrder,
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(
      FeedbacksThemeMapper.toDtoList(feedbacksThemes),
      {
        total,
        page,
        limit,
      }
    );
  }

  public async findOne(id: number) {
    const feedbacksTheme = await this.feedbacksThemeRepository.findOne({
      where: { id },
    });
    if (!feedbacksTheme) {
      throw new NotFoundException(this.i18n.t('errors.FEEDBACKS_THEME.NOT_FOUND'));
    }
    return FeedbacksThemeMapper.toDto(feedbacksTheme);
  }

  async update(id: number, updateFeedbacksThemeDto: UpdateFeedbacksThemeDto) {
    const feedbacksTheme = await this.feedbacksThemeRepository.findOne({ where: { id } });
    
    if (!feedbacksTheme) {
      throw new NotFoundException(this.i18n.t('errors.FEEDBACKS_THEME.NOT_FOUND'));
    }

    const updatedTheme = await this.feedbacksThemeRepository.save({
      ...feedbacksTheme,
      ...FeedbacksThemeMapper.toEntityFromUpdateDto(updateFeedbacksThemeDto, feedbacksTheme)
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.FEEDBACKS_THEME.UPDATED'),
      FeedbacksThemeMapper.toDto(updatedTheme)
    );
  }

  async remove(id: number) {
    const feedbacksTheme = await this.feedbacksThemeRepository.findOne({ where: { id } });
    
    if (!feedbacksTheme) {
      throw new NotFoundException(this.i18n.t('errors.FEEDBACKS_THEME.NOT_FOUND'));
    }

    await this.feedbacksThemeRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('success.FEEDBACKS_THEME.DELETED'));
  }
}
