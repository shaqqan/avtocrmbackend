import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AutoPosition, AutoModels } from 'src/databases/typeorm/entities';
import { CreateAutoPositionDto } from './dto/request/create-auto-position.dto';
import { UpdateAutoPositionDto } from './dto/request/update-auto-position.dto';
import { AutoPositionMapper } from './mapper/auto-position.mapper';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { FindAllAutoPositionDto } from './dto/request/find-all-auto-position.dto';
import { MessageWithDataResponseDto } from 'src/common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from 'src/common/dto/response/message.res.dto';

@Injectable()
export class AutoPositionService {
  constructor(
    @InjectRepository(AutoPosition)
    private readonly autoPositionRepository: Repository<AutoPosition>,
    @InjectRepository(AutoModels)
    private readonly autoModelRepository: Repository<AutoModels>,
    private readonly i18n: I18nService,
  ) {}

  async create(createAutoPositionDto: CreateAutoPositionDto) {
    // Check if auto model exists
    const autoModel = await this.autoModelRepository.findOne({
      where: { id: createAutoPositionDto.autoModelId },
    });

    if (!autoModel) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_MODEL.NOT_FOUND'),
      );
    }

    // Check if position name already exists for this auto model
    const existingPosition = await this.autoPositionRepository.findOne({
      where: { 
        name: createAutoPositionDto.name,
        autoModelId: createAutoPositionDto.autoModelId,
      },
    });

    if (existingPosition) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_POSITION.NAME_ALREADY_EXISTS_FOR_MODEL'),
      );
    }

    // Create auto position entity
    const autoPosition = this.autoPositionRepository.create({
      name: createAutoPositionDto.name,
      autoModelId: createAutoPositionDto.autoModelId,
    });

    const savedPosition = await this.autoPositionRepository.save(autoPosition);

    // Fetch position with relations for response
    const positionWithModel = await this.autoPositionRepository.findOne({
      where: { id: savedPosition.id },
      relations: { autoModel: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUTO_POSITION.CREATED'),
      AutoPositionMapper.toDto(positionWithModel!),
    );
  }

  public async findAll(query: FindAllAutoPositionDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search, autoModelId } = query;

    const allowedSortFields = [
      'id',
      'name',
      'autoModelId',
      'createdAt',
      'updatedAt',
    ];

    // Validate sortBy field
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    // Validate sortOrder
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder?.toUpperCase())
      ? (sortOrder.toUpperCase() as 'ASC' | 'DESC')
      : 'DESC';

    // Build where conditions for search and filters
    let whereCondition: any = {};
    
    // Add autoModelId filter
    if (autoModelId) {
      whereCondition.autoModelId = autoModelId;
    }
    
    // Add search conditions
    if (search) {
      if (autoModelId) {
        // If we have autoModelId filter, we need to use OR for search
        whereCondition = [
          { ...whereCondition, name: ILike(`%${search}%`) },
          { ...whereCondition, autoModel: { name: ILike(`%${search}%`) } },
        ];
      } else {
        // If no autoModelId filter, use simple OR for search
        whereCondition = [
          { name: ILike(`%${search}%`) },
          { autoModel: { name: ILike(`%${search}%`) } },
        ];
      }
    }

    const [positions, total] = await this.autoPositionRepository.findAndCount({
      select: {
        id: true,
        name: true,
        autoModelId: true,
        createdAt: true,
        updatedAt: true,
        autoModel: {
          id: true,
          name: true,
          brand: {
            id: true,
            name: true,
          },
        },
      },
      where: whereCondition,
      order: {
        [validSortBy]: validSortOrder,
      },
      relations: {
        autoModel: {
          brand: true,
        },
      },
      skip,
      take,
    });

    return {
      data: AutoPositionMapper.toDtoList(positions),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async findOne(id: number) {
    const position = await this.autoPositionRepository.findOne({
      where: { id },
      relations: {
        autoModel: {
          brand: true,
        },
      },
    });

    if (!position) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_POSITION.NOT_FOUND'));
    }

    return AutoPositionMapper.toDto(position);
  }

  async update(id: number, updateAutoPositionDto: UpdateAutoPositionDto) {
    const position = await this.autoPositionRepository.findOne({
      where: { id },
      relations: { autoModel: true },
    });

    if (!position) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_POSITION.NOT_FOUND'));
    }

    // Check if auto model exists if autoModelId is being changed
    if (updateAutoPositionDto.autoModelId && updateAutoPositionDto.autoModelId !== position.autoModelId) {
      const autoModel = await this.autoModelRepository.findOne({
        where: { id: updateAutoPositionDto.autoModelId },
      });

      if (!autoModel) {
        throw new BadRequestException(
          this.i18n.t('errors.AUTO_MODEL.NOT_FOUND'),
        );
      }
    }

    // Check if position name already exists for the auto model (if name or autoModelId is being changed)
    if ((updateAutoPositionDto.name && updateAutoPositionDto.name !== position.name) ||
        (updateAutoPositionDto.autoModelId && updateAutoPositionDto.autoModelId !== position.autoModelId)) {
      const existingPosition = await this.autoPositionRepository.findOne({
        where: { 
          name: updateAutoPositionDto.name || position.name,
          autoModelId: updateAutoPositionDto.autoModelId || position.autoModelId,
        },
      });

      if (existingPosition && existingPosition.id !== id) {
        throw new BadRequestException(
          this.i18n.t('errors.AUTO_POSITION.NAME_ALREADY_EXISTS_FOR_MODEL'),
        );
      }
    }

    // Update position
    const updatedPosition = await this.autoPositionRepository.save({
      ...position,
      ...AutoPositionMapper.toEntityFromUpdateDto(updateAutoPositionDto, position),
    });

    // Fetch updated position with relations
    const positionWithModel = await this.autoPositionRepository.findOne({
      where: { id: updatedPosition.id },
      relations: { 
        autoModel: {
          brand: true,
        },
      },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUTO_POSITION.UPDATED'),
      AutoPositionMapper.toDto(positionWithModel!),
    );
  }

  async remove(id: number) {
    const position = await this.autoPositionRepository.findOne({
      where: { id },
    });

    if (!position) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_POSITION.NOT_FOUND'));
    }

    // Soft delete using TypeORM's soft delete feature
    await this.autoPositionRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.AUTO_POSITION.DELETED'));
  }

  // Additional method to get positions by auto model
  async findPositionsByAutoModel(autoModelId: number) {
    const positions = await this.autoPositionRepository.find({
      where: { autoModelId },
      relations: { 
        autoModel: {
          brand: true,
        },
      },
      order: { name: 'ASC' },
    });

    return AutoPositionMapper.toDtoList(positions);
  }

  // Additional method to get positions by auto model name
  async findPositionsByAutoModelName(modelName: string) {
    const positions = await this.autoPositionRepository
      .createQueryBuilder('position')
      .leftJoinAndSelect('position.autoModel', 'autoModel')
      .leftJoinAndSelect('autoModel.brand', 'brand')
      .where('autoModel.name ILIKE :modelName', { modelName: `%${modelName}%` })
      .orderBy('autoModel.name', 'ASC')
      .addOrderBy('position.name', 'ASC')
      .getMany();

    return AutoPositionMapper.toDtoList(positions);
  }

  // Additional method to get positions by brand name
  async findPositionsByBrandName(brandName: string) {
    const positions = await this.autoPositionRepository
      .createQueryBuilder('position')
      .leftJoinAndSelect('position.autoModel', 'autoModel')
      .leftJoinAndSelect('autoModel.brand', 'brand')
      .where('brand.name ILIKE :brandName', { brandName: `%${brandName}%` })
      .orderBy('brand.name', 'ASC')
      .addOrderBy('autoModel.name', 'ASC')
      .addOrderBy('position.name', 'ASC')
      .getMany();

    return AutoPositionMapper.toDtoList(positions);
  }

  // Additional method to get positions with auto model information
  async findPositionsWithAutoModelInfo() {
    const positions = await this.autoPositionRepository
      .createQueryBuilder('position')
      .leftJoinAndSelect('position.autoModel', 'autoModel')
      .leftJoinAndSelect('autoModel.brand', 'brand')
      .select([
        'position.id',
        'position.name',
        'position.autoModelId',
        'position.createdAt',
        'position.updatedAt',
        'autoModel.id',
        'autoModel.name',
        'brand.id',
        'brand.name',
      ])
      .orderBy('brand.name', 'ASC')
      .addOrderBy('autoModel.name', 'ASC')
      .addOrderBy('position.name', 'ASC')
      .getMany();

    return AutoPositionMapper.toDtoList(positions);
  }

  // Additional method to search positions by name pattern
  async findPositionsByNamePattern(pattern: string) {
    const positions = await this.autoPositionRepository.find({
      where: { name: ILike(`%${pattern}%`) },
      relations: { 
        autoModel: {
          brand: true,
        },
      },
      order: { name: 'ASC' },
    });

    return AutoPositionMapper.toDtoList(positions);
  }

  // Additional method to get all positions ordered by name
  async findAllOrderedByName() {
    const positions = await this.autoPositionRepository.find({
      relations: { 
        autoModel: {
          brand: true,
        },
      },
      order: { name: 'ASC' },
    });

    return AutoPositionMapper.toDtoList(positions);
  }

  // Additional method to check if position exists
  async positionExists(name: string, autoModelId: number): Promise<boolean> {
    const position = await this.autoPositionRepository.findOne({
      where: { name, autoModelId },
    });

    return !!position;
  }

  // Additional method to get positions count
  async getPositionsCount(): Promise<number> {
    return await this.autoPositionRepository.count();
  }

  // Additional method to get positions count by auto model
  async getPositionsCountByAutoModel(autoModelId: number): Promise<number> {
    return await this.autoPositionRepository.count({
      where: { autoModelId },
    });
  }
}
