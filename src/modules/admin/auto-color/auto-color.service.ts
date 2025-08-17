import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AutoColor } from 'src/databases/typeorm/entities';
import { CreateAutoColorDto } from './dto/request/create-auto-color.dto';
import { UpdateAutoColorDto } from './dto/request/update-auto-color.dto';
import { AutoColorMapper } from './mapper/auto-color.mapper';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { MessageWithDataResponseDto } from 'src/common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from 'src/common/dto/response/message.res.dto';
import { paginate, FilterOperator, FilterSuffix } from 'nestjs-paginate';
import { convertPaginatedResult } from 'src/common/utils/pagination.util';

@Injectable()
export class AutoColorService {
  constructor(
    @InjectRepository(AutoColor)
    private readonly autoColorRepository: Repository<AutoColor>,
    private readonly i18n: I18nService,
  ) {}

  async create(createAutoColorDto: CreateAutoColorDto) {
    // Check if color name already exists for the same modelgit
    const existingColor = await this.autoColorRepository.findOne({
      where: { 
        name: createAutoColorDto.name,
        autoModelId: createAutoColorDto.autoModelId 
      },
    });

    if (existingColor) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_COLOR.NAME_ALREADY_EXISTS'),
      );
    }

    // Create auto color entity
    const autoColor = this.autoColorRepository.create({
      name: createAutoColorDto.name,
      autoModelId: createAutoColorDto.autoModelId,
    });

    const savedColor = await this.autoColorRepository.save(autoColor);

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUTO_COLOR.CREATED'),
      AutoColorMapper.toDto(savedColor),
    );
  }

  public async findAll(query: BasePaginationDto) {
    const result = await paginate(query, this.autoColorRepository, {
      sortableColumns: ['id', 'name', 'autoModelId', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      select: ['id', 'name', 'autoModelId', 'createdAt', 'updatedAt', 'autoModel.id', 'autoModel.name'],
      relations: ['autoModel'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
        autoModelId: true,
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return convertPaginatedResult(result, AutoColorMapper.toDtoList);
  }

  public async findOne(id: number) {
    const color = await this.autoColorRepository.findOne({
      where: { id },
      relations: {
        autoModel: true,
      },
    });

    if (!color) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_COLOR.NOT_FOUND'));
    }

    return AutoColorMapper.toDto(color);
  }

  async update(id: number, updateAutoColorDto: UpdateAutoColorDto) {
    const color = await this.autoColorRepository.findOne({
      where: { id },
    });

    if (!color) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_COLOR.NOT_FOUND'));
    }

    // Check if name is being changed and if it already exists for the same model
    if (updateAutoColorDto.name && updateAutoColorDto.name !== color.name) {
      const modelId = updateAutoColorDto.autoModelId || color.autoModelId;
      const existingColor = await this.autoColorRepository.findOne({
        where: { 
          name: updateAutoColorDto.name,
          autoModelId: modelId 
        },
      });

      if (existingColor) {
        throw new BadRequestException(
          this.i18n.t('errors.AUTO_COLOR.NAME_ALREADY_EXISTS'),
        );
      }
    }

    // Update color
    const updatedColor = await this.autoColorRepository.save({
      ...color,
      ...AutoColorMapper.toEntityFromUpdateDto(updateAutoColorDto, color),
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUTO_COLOR.UPDATED'),
      AutoColorMapper.toDto(updatedColor),
    );
  }

  async remove(id: number) {
    const color = await this.autoColorRepository.findOne({
      where: { id },
    });

    if (!color) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_COLOR.NOT_FOUND'));
    }

    // Soft delete using TypeORM's soft delete feature
    await this.autoColorRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.AUTO_COLOR.DELETED'));
  }

  // Additional method to get colors by name pattern
  async findColorsByNamePattern(pattern: string) {
    const colors = await this.autoColorRepository.find({
      where: { name: ILike(`%${pattern}%`) },
      order: { name: 'ASC' },
    });

    return AutoColorMapper.toDtoList(colors);
  }

  // Additional method to get all colors ordered by name
  async findAllOrderedByName() {
    const colors = await this.autoColorRepository.find({
      order: { name: 'ASC' },
    });

    return AutoColorMapper.toDtoList(colors);
  }

  // Additional method to check if color exists
  async colorExists(name: string): Promise<boolean> {
    const color = await this.autoColorRepository.findOne({
      where: { name },
    });

    return !!color;
  }

  // Additional method to get colors count
  async getColorsCount(): Promise<number> {
    return await this.autoColorRepository.count();
  }

  // Additional method to get popular colors (most used)
  async getPopularColors(limit: number = 10) {
    const colors = await this.autoColorRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return AutoColorMapper.toDtoList(colors);
  }

  // Additional method to search colors by multiple criteria
  async searchColors(criteria: {
    name?: string;
    createdAfter?: Date;
    createdBefore?: Date;
  }) {
    const queryBuilder = this.autoColorRepository.createQueryBuilder('color');

    if (criteria.name) {
      queryBuilder.andWhere('color.name ILIKE :name', { name: `%${criteria.name}%` });
    }

    if (criteria.createdAfter) {
      queryBuilder.andWhere('color.createdAt >= :createdAfter', { createdAfter: criteria.createdAfter });
    }

    if (criteria.createdBefore) {
      queryBuilder.andWhere('color.createdAt <= :createdBefore', { createdBefore: criteria.createdBefore });
    }

    queryBuilder.orderBy('color.name', 'ASC');

    const colors = await queryBuilder.getMany();
    return AutoColorMapper.toDtoList(colors);
  }

  // Additional method to get colors by creation date range
  async findColorsByDateRange(startDate: Date, endDate: Date) {
    const colors = await this.autoColorRepository.find({
      where: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      order: { createdAt: 'DESC' },
    });

    return AutoColorMapper.toDtoList(colors);
  }

  // Additional method to get colors with pagination and filtering
  async findColorsWithFilters(filters: {
    name?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const { name, page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.autoColorRepository.createQueryBuilder('color');

    if (name) {
      queryBuilder.andWhere('color.name ILIKE :name', { name: `%${name}%` });
    }

    queryBuilder
      .orderBy(`color.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    const [colors, total] = await queryBuilder.getManyAndCount();

    return {
      data: AutoColorMapper.toDtoList(colors),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Additional method to get colors by auto model
  async findColorsByAutoModel(autoModelId: number) {
    const colors = await this.autoColorRepository.find({
      where: { autoModelId },
      relations: {
        autoModel: true,
      },
      order: { name: 'ASC' },
    });

    return AutoColorMapper.toDtoList(colors);
  }

  // Additional method to get colors with auto model information
  async findColorsWithAutoModelInfo() {
    const colors = await this.autoColorRepository
      .createQueryBuilder('color')
      .leftJoinAndSelect('color.autoModel', 'autoModel')
      .select([
        'color.id',
        'color.name',
        'color.autoModelId',
        'color.createdAt',
        'color.updatedAt',
        'autoModel.id',
        'autoModel.name',
      ])
      .orderBy('autoModel.name', 'ASC')
      .addOrderBy('color.name', 'ASC')
      .getMany();

    return AutoColorMapper.toDtoList(colors);
  }

  // Additional method to check if color exists for specific model
  async colorExistsForModel(name: string, autoModelId: number): Promise<boolean> {
    const color = await this.autoColorRepository.findOne({
      where: { name, autoModelId },
    });

    return !!color;
  }
}
