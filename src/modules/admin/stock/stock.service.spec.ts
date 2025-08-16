import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockService } from './stock.service';
import { Stock, Warehouse, AutoModels, AutoColor, AutoPosition, StockStatus } from 'src/databases/typeorm/entities';
import { CreateStockDto } from './dto/request/create-stock.dto';
import { UpdateStockDto } from './dto/request/update-stock.dto';
import { I18nService } from 'nestjs-i18n';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SortOrder } from 'src/common/dto/request/base-pagination.dto';

describe('StockService', () => {
  let service: StockService;
  let stockRepository: Repository<Stock>;
  let warehouseRepository: Repository<Warehouse>;
  let autoModelRepository: Repository<AutoModels>;
  let autoColorRepository: Repository<AutoColor>;
  let autoPositionRepository: Repository<AutoPosition>;

  const mockStockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockWarehouseRepository = {
    findOne: jest.fn(),
  };

  const mockAutoModelRepository = {
    findOne: jest.fn(),
  };

  const mockAutoColorRepository = {
    findOne: jest.fn(),
  };

  const mockAutoPositionRepository = {
    findOne: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: getRepositoryToken(Stock),
          useValue: mockStockRepository,
        },
        {
          provide: getRepositoryToken(Warehouse),
          useValue: mockWarehouseRepository,
        },
        {
          provide: getRepositoryToken(AutoModels),
          useValue: mockAutoModelRepository,
        },
        {
          provide: getRepositoryToken(AutoColor),
          useValue: mockAutoColorRepository,
        },
        {
          provide: getRepositoryToken(AutoPosition),
          useValue: mockAutoPositionRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    stockRepository = module.get<Repository<Stock>>(getRepositoryToken(Stock));
    warehouseRepository = module.get<Repository<Warehouse>>(getRepositoryToken(Warehouse));
    autoModelRepository = module.get<Repository<AutoModels>>(getRepositoryToken(AutoModels));
    autoColorRepository = module.get<Repository<AutoColor>>(getRepositoryToken(AutoColor));
    autoPositionRepository = module.get<Repository<AutoPosition>>(getRepositoryToken(AutoPosition));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new stock item', async () => {
      const createDto: CreateStockDto = {
        warehouseId: 1,
        autoModelId: 1,
        autoColorId: 1,
        autoPositionId: 1,
        bodyNumber: '1HGBH41JXMN109186',
        arrivalDate: '2024-01-15',
        status: StockStatus.AVAILABLE,
      };

      const mockWarehouse = { id: 1, name: 'Main Warehouse' };
      const mockAutoModel = { id: 1, name: 'Camry' };
      const mockAutoColor = { id: 1, name: 'Silver' };
      const mockAutoPosition = { id: 1, name: 'Front Left' };
      const mockStock = { id: 1, ...createDto };
      const mockStockWithRelations = { id: 1, ...createDto, warehouse: mockWarehouse, autoModel: mockAutoModel, autoColor: mockAutoColor, autoPosition: mockAutoPosition };

      mockWarehouseRepository.findOne.mockResolvedValue(mockWarehouse);
      mockAutoModelRepository.findOne.mockResolvedValue(mockAutoModel);
      mockAutoColorRepository.findOne.mockResolvedValue(mockAutoColor);
      mockAutoPositionRepository.findOne.mockResolvedValue(mockAutoPosition);
      
      // Configure findOne calls in the correct order
      mockStockRepository.findOne
        .mockResolvedValueOnce(null) // First call: check if body number exists
        .mockResolvedValueOnce(mockStockWithRelations); // Second call: get stock with relations
      
      mockStockRepository.save.mockResolvedValue(mockStock);

      const result = await service.create(createDto);

      expect(result.data).toBeDefined();
      expect(result.data.bodyNumber).toBe(createDto.bodyNumber);
      expect(mockStockRepository.save).toHaveBeenCalled();
    });

    it('should throw error if warehouse not found', async () => {
      const createDto: CreateStockDto = {
        warehouseId: 999,
        autoModelId: 1,
        autoColorId: 1,
        autoPositionId: 1,
        bodyNumber: '1HGBH41JXMN109186',
      };

      mockWarehouseRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if auto model not found', async () => {
      const createDto: CreateStockDto = {
        warehouseId: 1,
        autoModelId: 999,
        autoColorId: 1,
        autoPositionId: 1,
        bodyNumber: '1HGBH41JXMN109186',
      };

      const mockWarehouse = { id: 1, name: 'Main Warehouse' };
      mockWarehouseRepository.findOne.mockResolvedValue(mockWarehouse);
      mockAutoModelRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if auto color not found', async () => {
      const createDto: CreateStockDto = {
        warehouseId: 1,
        autoModelId: 1,
        autoColorId: 999,
        autoPositionId: 1,
        bodyNumber: '1HGBH41JXMN109186',
      };

      const mockWarehouse = { id: 1, name: 'Main Warehouse' };
      const mockAutoModel = { id: 1, name: 'Camry' };
      mockWarehouseRepository.findOne.mockResolvedValue(mockWarehouse);
      mockAutoColorRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if auto position not found', async () => {
      const createDto: CreateStockDto = {
        warehouseId: 1,
        autoModelId: 1,
        autoColorId: 1,
        autoPositionId: 999,
        bodyNumber: '1HGBH41JXMN109186',
      };

      const mockWarehouse = { id: 1, name: 'Main Warehouse' };
      const mockAutoModel = { id: 1, name: 'Camry' };
      const mockAutoColor = { id: 1, name: 'Silver' };
      mockWarehouseRepository.findOne.mockResolvedValue(mockWarehouse);
      mockAutoModelRepository.findOne.mockResolvedValue(mockAutoModel);
      mockAutoColorRepository.findOne.mockResolvedValue(mockAutoColor);
      mockAutoPositionRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if body number already exists', async () => {
      const createDto: CreateStockDto = {
        warehouseId: 1,
        autoModelId: 1,
        autoColorId: 1,
        autoPositionId: 1,
        bodyNumber: '1HGBH41JXMN109186',
      };

      const mockWarehouse = { id: 1, name: 'Main Warehouse' };
      const mockAutoModel = { id: 1, name: 'Camry' };
      const mockAutoColor = { id: 1, name: 'Silver' };
      const mockAutoPosition = { id: 1, name: 'Front Left' };
      const existingStock = { id: 1, bodyNumber: '1HGBH41JXMN109186' };

      mockWarehouseRepository.findOne.mockResolvedValue(mockWarehouse);
      mockAutoModelRepository.findOne.mockResolvedValue(mockAutoModel);
      mockAutoColorRepository.findOne.mockResolvedValue(mockAutoColor);
      mockAutoPositionRepository.findOne.mockResolvedValue(mockAutoPosition);
      mockStockRepository.findOne.mockResolvedValue(existingStock);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated stocks', async () => {
      const mockPaginationDto = {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortOrder: SortOrder.ASC,
        skip: 0,
        take: 10,
        search: undefined,
        filters: undefined,
      };

      const mockStocks = [
        { id: 1, bodyNumber: '1HGBH41JXMN109186' },
        { id: 2, bodyNumber: '2T1BURHE0JC123456' },
      ];

      mockStockRepository.findAndCount.mockResolvedValue([mockStocks, 2]);

      const result = await service.findAll(mockPaginationDto);

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a stock item by ID', async () => {
      const mockStock = {
        id: 1,
        bodyNumber: '1HGBH41JXMN109186',
        warehouse: { id: 1, name: 'Main Warehouse' },
        autoModel: { id: 1, name: 'Camry' },
        autoColor: { id: 1, name: 'Silver' },
        autoPosition: { id: 1, name: 'Front Left' },
      };

      mockStockRepository.findOne.mockResolvedValue(mockStock);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.bodyNumber).toBe('1HGBH41JXMN109186');
    });

    it('should throw error if stock not found', async () => {
      mockStockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a stock item', async () => {
      const updateDto: UpdateStockDto = {
        id: 1,
        bodyNumber: '1HGBH41JXMN109186_UPDATED',
      };

      const existingStock = {
        id: 1,
        bodyNumber: '1HGBH41JXMN109186',
        warehouseId: 1,
        autoModelId: 1,
        autoColorId: 1,
        autoPositionId: 1,
        warehouse: { id: 1, name: 'Main Warehouse' },
        autoModel: { id: 1, name: 'Camry' },
        autoColor: { id: 1, name: 'Silver' },
        autoPosition: { id: 1, name: 'Front Left' },
      };

      const updatedStock = { ...existingStock, ...updateDto };

      mockStockRepository.findOne
        .mockResolvedValueOnce(existingStock) // First call to find existing stock
        .mockResolvedValueOnce(null) // Second call for body number uniqueness check
        .mockResolvedValueOnce(updatedStock); // Third call to get updated stock with relations
      mockStockRepository.save.mockResolvedValue(updatedStock);

      const result = await service.update(1, updateDto);

      expect(result.data.bodyNumber).toBe(updateDto.bodyNumber);
      expect(mockStockRepository.save).toHaveBeenCalled();
    });

    it('should throw error if stock not found for update', async () => {
      const updateDto: UpdateStockDto = {
        id: 999,
        bodyNumber: '1HGBH41JXMN109186_UPDATED',
      };

      mockStockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a stock item', async () => {
      const mockStock = { id: 1, bodyNumber: '1HGBH41JXMN109186' };

      mockStockRepository.findOne.mockResolvedValue(mockStock);
      mockStockRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBeDefined();
      expect(mockStockRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw error if stock not found for deletion', async () => {
      mockStockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findStocksByWarehouse', () => {
    it('should return stocks by warehouse ID', async () => {
      const mockStocks = [
        { id: 1, bodyNumber: '1HGBH41JXMN109186' },
        { id: 2, bodyNumber: '2T1BURHE0JC123456' },
      ];

      mockStockRepository.find.mockResolvedValue(mockStocks);

      const result = await service.findStocksByWarehouse(1);

      expect(result).toHaveLength(2);
      expect(mockStockRepository.find).toHaveBeenCalledWith({
        where: { warehouseId: 1 },
        relations: {
          warehouse: true,
          autoModel: { brand: true },
          autoColor: true,
          autoPosition: true,
        },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findStocksByStatus', () => {
    it('should return stocks by status', async () => {
      const mockStocks = [
        { id: 1, bodyNumber: '1HGBH41JXMN109186', status: StockStatus.AVAILABLE },
      ];

      mockStockRepository.find.mockResolvedValue(mockStocks);

      const result = await service.findStocksByStatus(StockStatus.AVAILABLE);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(StockStatus.AVAILABLE);
    });
  });

  describe('getStocksSummary', () => {
    it('should return stocks summary', async () => {
      mockStockRepository.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5)  // available
        .mockResolvedValueOnce(3)  // reserved
        .mockResolvedValueOnce(2); // sold

      const result = await service.getStocksSummary();

      expect(result.total).toBe(10);
      expect(result.available).toBe(5);
      expect(result.reserved).toBe(3);
      expect(result.sold).toBe(2);
    });
  });
});
