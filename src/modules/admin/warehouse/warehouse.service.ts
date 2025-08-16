import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Warehouse } from 'src/databases/typeorm/entities';
import { CreateWarehouseDto } from './dto/request/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/request/update-warehouse.dto';
import { WarehouseMapper } from './mapper/warehouse.mapper';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { MessageWithDataResponseDto } from 'src/common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from 'src/common/dto/response/message.res.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private readonly i18n: I18nService,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    // Check if warehouse name already exists
    const existingWarehouse = await this.warehouseRepository.findOne({
      where: { name: createWarehouseDto.name },
    });

    if (existingWarehouse) {
      throw new BadRequestException(
        this.i18n.t('errors.WAREHOUSE.NAME_ALREADY_EXISTS'),
      );
    }

    // Create warehouse entity
    const warehouse = this.warehouseRepository.create({
      name: createWarehouseDto.name,
      address: createWarehouseDto.address,
      location: createWarehouseDto.location,
    });

    const savedWarehouse = await this.warehouseRepository.save(warehouse);

    return new MessageWithDataResponseDto(
      this.i18n.t('success.WAREHOUSE.CREATED'),
      WarehouseMapper.toDto(savedWarehouse),
    );
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search } = query;

    const allowedSortFields = [
      'id',
      'name',
      'address',
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

    // Build where conditions for search
    const whereConditions: any[] = [];
    if (search) {
      whereConditions.push(
        { name: ILike(`%${search}%`) },
        { address: ILike(`%${search}%`) },
      );
    }

    const [warehouses, total] = await this.warehouseRepository.findAndCount({
      select: {
        id: true,
        name: true,
        address: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [validSortBy]: validSortOrder,
      },
      skip,
      take,
    });

    return {
      data: WarehouseMapper.toDtoList(warehouses),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async findOne(id: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(this.i18n.t('errors.WAREHOUSE.NOT_FOUND'));
    }

    return WarehouseMapper.toDto(warehouse);
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(this.i18n.t('errors.WAREHOUSE.NOT_FOUND'));
    }

    // Check if name is being changed and if it already exists
    if (updateWarehouseDto.name && updateWarehouseDto.name !== warehouse.name) {
      const existingWarehouse = await this.warehouseRepository.findOne({
        where: { name: updateWarehouseDto.name },
      });

      if (existingWarehouse) {
        throw new BadRequestException(
          this.i18n.t('errors.WAREHOUSE.NAME_ALREADY_EXISTS'),
        );
      }
    }

    // Update warehouse
    const updatedWarehouse = await this.warehouseRepository.save({
      ...warehouse,
      ...WarehouseMapper.toEntityFromUpdateDto(updateWarehouseDto, warehouse),
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.WAREHOUSE.UPDATED'),
      WarehouseMapper.toDto(updatedWarehouse),
    );
  }

  async remove(id: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(this.i18n.t('errors.WAREHOUSE.NOT_FOUND'));
    }

    // Soft delete using TypeORM's soft delete feature
    await this.warehouseRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.WAREHOUSE.DELETED'));
  }

  // Additional method to get warehouses by name pattern
  async findWarehousesByNamePattern(pattern: string) {
    const warehouses = await this.warehouseRepository.find({
      where: { name: ILike(`%${pattern}%`) },
      order: { name: 'ASC' },
    });

    return WarehouseMapper.toDtoList(warehouses);
  }

  // Additional method to get warehouses by address pattern
  async findWarehousesByAddressPattern(pattern: string) {
    const warehouses = await this.warehouseRepository.find({
      where: { address: ILike(`%${pattern}%`) },
      order: { name: 'ASC' },
    });

    return WarehouseMapper.toDtoList(warehouses);
  }

  // Additional method to get all warehouses ordered by name
  async findAllOrderedByName() {
    const warehouses = await this.warehouseRepository.find({
      order: { name: 'ASC' },
    });

    return WarehouseMapper.toDtoList(warehouses);
  }

  // Additional method to get warehouses with location
  async findWarehousesWithLocation() {
    const warehouses = await this.warehouseRepository.find({
      where: { location: { $not: null } as any },
      order: { name: 'ASC' },
    });

    return WarehouseMapper.toDtoList(warehouses);
  }

  // Additional method to check if warehouse exists
  async warehouseExists(name: string): Promise<boolean> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { name },
    });

    return !!warehouse;
  }

  // Additional method to get warehouses count
  async getWarehousesCount(): Promise<number> {
    return await this.warehouseRepository.count();
  }

  // Additional method to get warehouses count with location
  async getWarehousesWithLocationCount(): Promise<number> {
    return await this.warehouseRepository.count({
      where: { location: { $not: null } as any },
    });
  }

  // Additional method to search warehouses by multiple criteria
  async searchWarehouses(criteria: {
    name?: string;
    address?: string;
    hasLocation?: boolean;
  }) {
    const queryBuilder = this.warehouseRepository.createQueryBuilder('warehouse');

    if (criteria.name) {
      queryBuilder.andWhere('warehouse.name ILIKE :name', { name: `%${criteria.name}%` });
    }

    if (criteria.address) {
      queryBuilder.andWhere('warehouse.address ILIKE :address', { address: `%${criteria.address}%` });
    }

    if (criteria.hasLocation !== undefined) {
      if (criteria.hasLocation) {
        queryBuilder.andWhere('warehouse.location IS NOT NULL');
      } else {
        queryBuilder.andWhere('warehouse.location IS NULL');
      }
    }

    queryBuilder.orderBy('warehouse.name', 'ASC');

    const warehouses = await queryBuilder.getMany();
    return WarehouseMapper.toDtoList(warehouses);
  }
}
