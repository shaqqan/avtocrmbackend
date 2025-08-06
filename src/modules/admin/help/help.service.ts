import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateHelpDto } from './dto/request/create-help.dto';
import { UpdateHelpDto } from './dto/request/update-help.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Help } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import {
  BasePaginationResponseDto,
  MessageWithDataResponseDto,
  MessageResponseDto,
} from 'src/common/dto/response';
import { HelpMapper } from './mapper/help.mapper';
import { currentLocale } from 'src/common/utils';

@Injectable({ scope: Scope.REQUEST })
export class HelpService {
  constructor(
    @InjectRepository(Help)
    private readonly helpRepository: Repository<Help>,
    private readonly i18n: I18nService,
  ) {}

  async create(createHelpDto: CreateHelpDto) {
    const help = await this.helpRepository.save(
      HelpMapper.toEntityFromCreateDto(createHelpDto),
    );
    return new MessageWithDataResponseDto(
      this.i18n.t('success.HELP.CREATED'),
      HelpMapper.toDto(help),
    );
  }

  public async findAll(query: BasePaginationDto) {
    const {
      take,
      skip,
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
    } = query;
    const locale = currentLocale();

    const allowedSortFields = ['id', 'name', 'description', 'createdAt'];

    // Validate sortBy field
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    // Handle localized sort fields
    const localizableFields = ['name', 'description'];
    const actualSortField = localizableFields.includes(validSortBy)
      ? `${validSortBy}_${locale}`
      : validSortBy;

    // Validate sortOrder
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder?.toUpperCase())
      ? (sortOrder.toUpperCase() as 'ASC' | 'DESC')
      : 'DESC';

    // Build where conditions for search
    const whereConditions: any[] = [];
    if (search) {
      whereConditions.push(
        { [`name_${locale}`]: Like(`%${search}%`) },
        { [`description_${locale}`]: Like(`%${search}%`) },
      );
    }

    const [helps, total] = await this.helpRepository.findAndCount({
      select: {
        id: true,
        [`name_${locale}`]: true,
        [`description_${locale}`]: true,
        createdAt: true,
      },
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [actualSortField]: validSortOrder,
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(HelpMapper.toDtoList(helps), {
      total,
      page,
      limit,
    });
  }

  public async findOne(id: number) {
    const help = await this.helpRepository.findOne({
      where: { id },
    });
    if (!help) {
      throw new NotFoundException(this.i18n.t('errors.HELP.NOT_FOUND'));
    }
    return HelpMapper.toDto(help);
  }

  async update(id: number, updateHelpDto: UpdateHelpDto) {
    const help = await this.helpRepository.findOne({ where: { id } });
    if (!help) {
      throw new NotFoundException(this.i18n.t('errors.HELP.NOT_FOUND'));
    }

    const updatedHelp = await this.helpRepository.save({
      ...help,
      ...HelpMapper.toEntityFromUpdateDto(updateHelpDto, help),
    });
    return new MessageWithDataResponseDto(
      this.i18n.t('success.HELP.UPDATED'),
      HelpMapper.toDto(updatedHelp),
    );
  }

  async remove(id: number) {
    const help = await this.helpRepository.findOne({ where: { id } });
    if (!help) {
      throw new NotFoundException(this.i18n.t('errors.HELP.NOT_FOUND'));
    }

    await this.helpRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('success.HELP.DELETED'));
  }
}
