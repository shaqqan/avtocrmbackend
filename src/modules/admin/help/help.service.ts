import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHelpDto } from './dto/request/create-help.dto';
import { UpdateHelpDto } from './dto/request/update-help.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Help } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationResponseDto } from 'src/common/dto/response';
import { HelpMapper } from './mapper/help.mapper';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(Help)
    private readonly helpRepository: Repository<Help>,
    private readonly i18n: I18nService,
  ) { }

  create(createHelpDto: CreateHelpDto) {
    return 'This action adds a new help';
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy = 'createdAt', sortOrder = 'DESC', search } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';

    const allowedSortFields = ['id', 'name', 'description', 'createdAt'];

    // Validate sortBy field
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // Handle localized sort fields
    const localizableFields = ['name', 'description'];
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
        { [`name_${currentLocale}`]: Like(`%${search}%`) },
        { [`description_${currentLocale}`]: Like(`%${search}%`) }
      );
    }

    const [helps, total] = await this.helpRepository.findAndCount({
      select: {
        id: true,
        [`name_${currentLocale}`]: true,
        [`description_${currentLocale}`]: true,
        createdAt: true,
      },
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [actualSortField]: validSortOrder,
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(
      HelpMapper.toDtoList(helps),
      {
        total,
        page,
        limit,
      }
    );
  }

  public async findOne(id: number) {
    const help = await this.helpRepository.findOne({
      where: { id },
    });
    if (!help) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    return HelpMapper.toDto(help);
  }

  update(id: number, updateHelpDto: UpdateHelpDto) {
    return `This action updates a #${id} help`;
  }

  remove(id: number) {
    return `This action removes a #${id} help`;
  }
}
