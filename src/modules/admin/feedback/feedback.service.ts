import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateFeedbackDto } from './dto/request/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/request/update-feedback.dto';
import { QueryFeedbackDto } from './dto/request/query-feedback.dto';
import { Feedback } from 'src/databases/typeorm/entities';
import { BasePaginationDto } from 'src/common/dto/request';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { FeedbackMapper } from './mapper/feedback.mapper';
import { FeedbackResponseDto } from './dto/response/feedback-response.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ scope: Scope.REQUEST })
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly i18n: I18nService,
  ) { }

  async create(createFeedbackDto: CreateFeedbackDto) {
    const feedback = await this.feedbackRepository.save(createFeedbackDto);
    return new MessageWithDataResponseDto(this.i18n.t('success.FEEDBACK.CREATED'), FeedbackMapper.toDto(feedback));
  }

  async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy = 'createdAt', sortOrder = 'DESC', search } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';

    const allowedSortFields = ['id', 'name', 'createdAt', 'updatedAt'];

    // Validate sortBy field
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const whereConditions: any[] = [];
    if (search) {
      whereConditions.push(
        { [`name_${currentLocale}`]: ILike(`%${search}%`) }
      );
    }

    const [data, total] = await this.feedbackRepository.findAndCount({
      where: whereConditions,
      relations: {
        feedbacksTheme: true,
      },
      order: { [validSortBy]: sortOrder },
      take,
      skip,
    });

    return new BasePaginationResponseDto(
      FeedbackMapper.toDtoList(data),
      {
        total,
        page,
        limit,
      }
    );
  }

  async findOne(id: number): Promise<FeedbackResponseDto> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['feedbacksTheme'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return FeedbackMapper.toDto(feedback);
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException(this.i18n.t('errors.FEEDBACK.NOT_FOUND'));
    }

    await this.feedbackRepository.update(id, updateFeedbackDto);
    const updatedFeedback = await this.feedbackRepository.findOne({ where: { id }, relations: { feedbacksTheme: true } });
    if (!updatedFeedback) {
      throw new NotFoundException(this.i18n.t('errors.FEEDBACK.NOT_FOUND')); 
    }
    return new MessageWithDataResponseDto(this.i18n.t('success.FEEDBACK.UPDATED'), FeedbackMapper.toDto(updatedFeedback));
  }

  async remove(id: number) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException(this.i18n.t('errors.FEEDBACK.NOT_FOUND'));
    }

    await this.feedbackRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('success.FEEDBACK.DELETED'));
  }

}
