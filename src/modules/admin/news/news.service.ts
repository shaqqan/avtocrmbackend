import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/request/create-news.dto';
import { UpdateNewsDto } from './dto/request/update-news.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { News } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { NewsMapper } from './mapper/news.mapper';
import { BasePaginationResponseDto } from 'src/common/dto/response';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private readonly i18n: I18nService
  ) { }
  create(createNewsDto: CreateNewsDto) {
    return 'This action adds a new news';
  }


  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy = 'createdAt', sortOrder = 'DESC', search } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';

    const allowedSortFields: string[] = ['title', 'description', 'status', 'createdAt', 'updatedAt'];

    // Validate sortBy field
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // Handle localized fields
    const localizableFields = ['title', 'description'];
    const actualSortField = localizableFields.includes(validSortBy)
      ? `${validSortBy}_${currentLocale}`
      : validSortBy;

    // Validate sortOrder
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder?.toUpperCase())
      ? sortOrder.toUpperCase() as 'ASC' | 'DESC'
      : 'DESC';

    // Build where conditions
    const whereConditions: any[] = [];
    if (search) {
      whereConditions.push(
        { [`title_${currentLocale}`]: Like(`%${search}%`) },
        { [`description_${currentLocale}`]: Like(`%${search}%`) }
      );
    }

    const [news, total] = await this.newsRepository.findAndCount({
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [actualSortField]: validSortOrder,
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(
      NewsMapper.toDtoList(news),
      {
        total,
        page,
        limit,
      }
    );
  }
  public async findOne(id: number) {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    return NewsMapper.toDto(news);
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
