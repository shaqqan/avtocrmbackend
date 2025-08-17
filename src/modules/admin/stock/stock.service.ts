import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Stock, Warehouse, AutoModels, AutoColor, AutoPosition, StockStatus } from 'src/databases/typeorm/entities';
import { CreateStockDto } from './dto/request/create-stock.dto';
import { UpdateStockDto } from './dto/request/update-stock.dto';
import { StockMapper } from './mapper/stock.mapper';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { MessageWithDataResponseDto } from 'src/common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from 'src/common/dto/response/message.res.dto';
import { paginate, FilterOperator, FilterSuffix } from 'nestjs-paginate';
import { convertPaginatedResult } from 'src/common/utils/pagination.util';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(AutoModels)
    private readonly autoModelRepository: Repository<AutoModels>,
    @InjectRepository(AutoColor)
    private readonly autoColorRepository: Repository<AutoColor>,
    @InjectRepository(AutoPosition)
    private readonly autoPositionRepository: Repository<AutoPosition>,
    private readonly i18n: I18nService,
  ) {}

  async create(createStockDto: CreateStockDto) {
    // Check if warehouse exists
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: createStockDto.warehouseId },
    });

    if (!warehouse) {
      throw new BadRequestException(
        this.i18n.t('errors.WAREHOUSE.NOT_FOUND'),
      );
    }

    // Check if auto model exists
    const autoModel = await this.autoModelRepository.findOne({
      where: { id: createStockDto.autoModelId },
    });

    if (!autoModel) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_MODEL.NOT_FOUND'),
      );
    }

    // Check if auto color exists
    const autoColor = await this.autoColorRepository.findOne({
      where: { id: createStockDto.autoColorId },
    });

    if (!autoColor) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_COLOR.NOT_FOUND'),
      );
    }

    // Check if auto position exists
    const autoPosition = await this.autoPositionRepository.findOne({
      where: { id: createStockDto.autoPositionId },
    });

    if (!autoPosition) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_POSITION.NOT_FOUND'),
      );
    }

    // Check if body number already exists
    const existingStock = await this.stockRepository.findOne({
      where: { bodyNumber: createStockDto.bodyNumber },
    });

    if (existingStock) {
      throw new BadRequestException(
        this.i18n.t('errors.STOCK.BODY_NUMBER_ALREADY_EXISTS'),
      );
    }

    // Create stock entity
    const stock = new Stock();
    stock.warehouseId = createStockDto.warehouseId;
    stock.autoModelId = createStockDto.autoModelId;
    stock.autoColorId = createStockDto.autoColorId;
    stock.autoPositionId = createStockDto.autoPositionId;
    stock.bodyNumber = createStockDto.bodyNumber;
    if (createStockDto.arrivalDate) {
      stock.arrivalDate = new Date(createStockDto.arrivalDate);
    }
    stock.status = createStockDto.status || StockStatus.AVAILABLE;

    const savedStock = await this.stockRepository.save(stock);

    // Fetch stock with relations for response
    const stockWithRelations = await this.stockRepository.findOne({
      where: { id: savedStock.id },
      relations: {
        warehouse: true,
        autoModel: { brand: true },
        autoColor: true,
        autoPosition: { autoModel: { brand: true } },
      },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.STOCK.CREATED'),
      StockMapper.toDto(stockWithRelations!),
    );
  }

  public async findAll(query: BasePaginationDto) {
    const result = await paginate(query, this.stockRepository, {
      sortableColumns: ['id', 'bodyNumber', 'arrivalDate', 'status', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['bodyNumber', 'warehouse.name', 'autoModel.name', 'autoColor.name', 'autoPosition.name'],
      select: [
        'id',
        'warehouseId',
        'autoModelId',
        'autoColorId',
        'autoPositionId',
        'bodyNumber',
        'arrivalDate',
        'status',
        'createdAt',
        'updatedAt',
        'warehouse.id',
        'warehouse.name',
        'warehouse.address',
        'autoModel.id',
        'autoModel.name',
        'autoModel.brand.id',
        'autoModel.brand.name',
        'autoColor.id',
        'autoColor.name',
        'autoPosition.id',
        'autoPosition.name'
      ],
      relations: ['warehouse', 'autoModel', 'autoModel.brand', 'autoColor', 'autoPosition'],
      filterableColumns: {
        bodyNumber: [FilterOperator.EQ, FilterSuffix.NOT],
        status: [FilterOperator.EQ, FilterSuffix.NOT],
        warehouseId: true,
        autoModelId: true,
        autoColorId: true,
        autoPositionId: true,
        id: true,
        arrivalDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return convertPaginatedResult(result, StockMapper.toDtoList);
  }

  public async findOne(id: number) {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: {
        warehouse: true,
        autoModel: { brand: true },
        autoColor: true,
        autoPosition: { autoModel: { brand: true } },
      },
    });

    if (!stock) {
      throw new NotFoundException(this.i18n.t('errors.STOCK.NOT_FOUND'));
    }

    return StockMapper.toDto(stock);
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: {
        warehouse: true,
        autoModel: true,
        autoColor: true,
        autoPosition: true,
      },
    });

    if (!stock) {
      throw new NotFoundException(this.i18n.t('errors.STOCK.NOT_FOUND'));
    }

    // Check if warehouse exists if warehouseId is being changed
    if (updateStockDto.warehouseId && updateStockDto.warehouseId !== stock.warehouseId) {
      const warehouse = await this.warehouseRepository.findOne({
        where: { id: updateStockDto.warehouseId },
      });

      if (!warehouse) {
        throw new BadRequestException(
          this.i18n.t('errors.WAREHOUSE.NOT_FOUND'),
        );
      }
    }

    // Check if auto model exists if autoModelId is being changed
    if (updateStockDto.autoModelId && updateStockDto.autoModelId !== stock.autoModelId) {
      const autoModel = await this.autoModelRepository.findOne({
        where: { id: updateStockDto.autoModelId },
      });

      if (!autoModel) {
        throw new BadRequestException(
          this.i18n.t('errors.AUTO_MODEL.NOT_FOUND'),
        );
      }
    }

    // Check if auto color exists if autoColorId is being changed
    if (updateStockDto.autoColorId && updateStockDto.autoColorId !== stock.autoColorId) {
      const autoColor = await this.autoColorRepository.findOne({
        where: { id: updateStockDto.autoColorId },
      });

      if (!autoColor) {
        throw new BadRequestException(
          this.i18n.t('errors.AUTO_COLOR.NOT_FOUND'),
        );
      }
    }

    // Check if auto position exists if autoPositionId is being changed
    if (updateStockDto.autoPositionId && updateStockDto.autoPositionId !== stock.autoPositionId) {
      const autoPosition = await this.autoPositionRepository.findOne({
        where: { id: updateStockDto.autoPositionId },
      });

      if (!autoPosition) {
        throw new BadRequestException(
          this.i18n.t('errors.AUTO_POSITION.NOT_FOUND'),
        );
      }
    }

    // Check if body number already exists if it's being changed
    if (updateStockDto.bodyNumber && updateStockDto.bodyNumber !== stock.bodyNumber) {
      const existingStock = await this.stockRepository.findOne({
        where: { bodyNumber: updateStockDto.bodyNumber },
      });

      if (existingStock) {
        throw new BadRequestException(
          this.i18n.t('errors.STOCK.BODY_NUMBER_ALREADY_EXISTS'),
        );
      }
    }

    // Update stock
    const updatedStock = await this.stockRepository.save({
      ...stock,
      ...StockMapper.toEntityFromUpdateDto(updateStockDto, stock),
    });

    // Fetch updated stock with relations
    const stockWithRelations = await this.stockRepository.findOne({
      where: { id: updatedStock.id },
      relations: {
        warehouse: true,
        autoModel: { brand: true },
        autoColor: true,
        autoPosition: { autoModel: { brand: true } },
      },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.STOCK.UPDATED'),
      StockMapper.toDto(stockWithRelations!),
    );
  }

  async remove(id: number) {
    const stock = await this.stockRepository.findOne({
      where: { id },
    });

    if (!stock) {
      throw new NotFoundException(this.i18n.t('errors.STOCK.NOT_FOUND'));
    }

    // Soft delete using TypeORM's soft delete feature
    await this.stockRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.STOCK.DELETED'));
  }

  // Additional method to get stocks by warehouse
  async findStocksByWarehouse(warehouseId: number) {
    const stocks = await this.stockRepository.find({
      where: { warehouseId },
      relations: {
        warehouse: true,
        autoModel: { brand: true },
        autoColor: true,
        autoPosition: true,
      },
      order: { createdAt: 'DESC' },
    });

    return StockMapper.toDtoList(stocks);
  }

  // Additional method to get stocks by auto model
  async findStocksByAutoModel(autoModelId: number) {
    const stocks = await this.stockRepository.find({
      where: { autoModelId },
      relations: {
        warehouse: true,
        autoModel: { brand: true },
        autoColor: true,
        autoPosition: true,
      },
      order: { createdAt: 'DESC' },
    });

    return StockMapper.toDtoList(stocks);
  }

  // Additional method to get stocks by status
  async findStocksByStatus(status: StockStatus) {
    const stocks = await this.stockRepository.find({
      where: { status },
      relations: {
        warehouse: true,
        autoModel: { brand: true },
        autoColor: true,
        autoPosition: true,
      },
      order: { createdAt: 'DESC' },
    });

    return StockMapper.toDtoList(stocks);
  }

  // Additional method to get stocks by body number pattern
  async findStocksByBodyNumberPattern(pattern: string) {
    const stocks = await this.stockRepository.find({
      where: { bodyNumber: ILike(`%${pattern}%`) },
      relations: {
        warehouse: true,
        autoModel: { brand: true },
        autoColor: true,
        autoPosition: true,
      },
      order: { bodyNumber: 'ASC' },
    });

    return StockMapper.toDtoList(stocks);
  }

  // Additional method to get stocks by arrival date range
  async findStocksByArrivalDateRange(startDate: Date, endDate: Date) {
    const stocks = await this.stockRepository.find({
      where: {
        arrivalDate: Between(startDate, endDate),
      },
      relations: {
        warehouse: true,
        autoModel: { brand: true },
        autoColor: true,
        autoPosition: true,
      },
      order: { arrivalDate: 'DESC' },
    });

    return StockMapper.toDtoList(stocks);
  }

  // Additional method to get stocks count by status
  async getStocksCountByStatus(status: StockStatus): Promise<number> {
    return await this.stockRepository.count({
      where: { status },
    });
  }

  // Additional method to get total stocks count
  async getTotalStocksCount(): Promise<number> {
    return await this.stockRepository.count();
  }

  // Additional method to get stocks summary
  async getStocksSummary() {
    const [total, available, reserved, sold] = await Promise.all([
      this.stockRepository.count(),
      this.stockRepository.count({ where: { status: StockStatus.AVAILABLE } }),
      this.stockRepository.count({ where: { status: StockStatus.RESERVED } }),
      this.stockRepository.count({ where: { status: StockStatus.SOLD } }),
    ]);

    return {
      total,
      available,
      reserved,
      sold,
    };
  }

  // Additional method to search stocks by multiple criteria
  async searchStocks(criteria: {
    warehouseId?: number;
    autoModelId?: number;
    autoColorId?: number;
    autoPositionId?: number;
    status?: StockStatus;
    bodyNumber?: string;
    arrivalDateAfter?: Date;
    arrivalDateBefore?: Date;
  }) {
    const queryBuilder = this.stockRepository.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.warehouse', 'warehouse')
      .leftJoinAndSelect('stock.autoModel', 'autoModel')
      .leftJoinAndSelect('autoModel.brand', 'brand')
      .leftJoinAndSelect('stock.autoColor', 'autoColor')
      .leftJoinAndSelect('stock.autoPosition', 'autoPosition');

    if (criteria.warehouseId) {
      queryBuilder.andWhere('stock.warehouseId = :warehouseId', { warehouseId: criteria.warehouseId });
    }

    if (criteria.autoModelId) {
      queryBuilder.andWhere('stock.autoModelId = :autoModelId', { autoModelId: criteria.autoModelId });
    }

    if (criteria.autoColorId) {
      queryBuilder.andWhere('stock.autoColorId = :autoColorId', { autoColorId: criteria.autoColorId });
    }

    if (criteria.autoPositionId) {
      queryBuilder.andWhere('stock.autoPositionId = :autoPositionId', { autoPositionId: criteria.autoPositionId });
    }

    if (criteria.status) {
      queryBuilder.andWhere('stock.status = :status', { status: criteria.status });
    }

    if (criteria.bodyNumber) {
      queryBuilder.andWhere('stock.bodyNumber ILIKE :bodyNumber', { bodyNumber: `%${criteria.bodyNumber}%` });
    }

    if (criteria.arrivalDateAfter) {
      queryBuilder.andWhere('stock.arrivalDate >= :arrivalDateAfter', { arrivalDateAfter: criteria.arrivalDateAfter });
    }

    if (criteria.arrivalDateBefore) {
      queryBuilder.andWhere('stock.arrivalDate <= :arrivalDateBefore', { arrivalDateBefore: criteria.arrivalDateBefore });
    }

    queryBuilder.orderBy('stock.createdAt', 'DESC');

    const stocks = await queryBuilder.getMany();
    return StockMapper.toDtoList(stocks);
  }
}
