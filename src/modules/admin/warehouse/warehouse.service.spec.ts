import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from 'src/databases/typeorm/entities';
import { CreateWarehouseDto } from './dto/request/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/request/update-warehouse.dto';
import { SortOrder } from 'src/common/dto/request/base-pagination.dto';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let repository: Repository<Warehouse>;
  let i18nService: I18nService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    softDelete: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  const mockI18nService = {
    t: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        {
          provide: getRepositoryToken(Warehouse),
          useValue: mockRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
    repository = module.get<Repository<Warehouse>>(getRepositoryToken(Warehouse));
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new warehouse', async () => {
      const createDto: CreateWarehouseDto = { 
        name: 'Main Distribution Center', 
        address: '123 Industrial Blvd, Tashkent, Uzbekistan',
        location: 'POINT(41.2995 69.2401)'
      };
      const mockWarehouse = { 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan',
        location: 'POINT(41.2995 69.2401)'
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockWarehouse);
      mockRepository.save.mockResolvedValue(mockWarehouse);

      const result = await service.create(createDto);

      expect(result.data.name).toBe('Main Distribution Center');
      expect(result.data.address).toBe('123 Industrial Blvd, Tashkent, Uzbekistan');
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw error if warehouse name already exists', async () => {
      const createDto: CreateWarehouseDto = { 
        name: 'Main Distribution Center', 
        address: '123 Industrial Blvd, Tashkent, Uzbekistan'
      };
      const existingWarehouse = { 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan'
      };

      mockRepository.findOne.mockResolvedValue(existingWarehouse);

      await expect(service.create(createDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated warehouses', async () => {
      const mockWarehouses = [{ 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan',
        location: 'POINT(41.2995 69.2401)'
      }];
      const mockTotal = 1;

      mockRepository.findAndCount.mockResolvedValue([mockWarehouses, mockTotal]);

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

      const result = await service.findAll(mockPaginationDto);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a warehouse by id', async () => {
      const mockWarehouse = { 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan',
        location: 'POINT(41.2995 69.2401)'
      };

      mockRepository.findOne.mockResolvedValue(mockWarehouse);

      const result = await service.findOne(1);

      expect(result.name).toBe('Main Distribution Center');
      expect(result.address).toBe('123 Industrial Blvd, Tashkent, Uzbekistan');
    });

    it('should throw error if warehouse not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a warehouse', async () => {
      const updateDto: UpdateWarehouseDto = { 
        id: 1, 
        name: 'Updated Distribution Center' 
      };
      const existingWarehouse = { 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan',
        location: 'POINT(41.2995 69.2401)'
      };
      const updatedWarehouse = { ...existingWarehouse, name: 'Updated Distribution Center' };

      mockRepository.findOne.mockResolvedValueOnce(existingWarehouse);
      mockRepository.findOne.mockResolvedValueOnce(null); // No duplicate name
      mockRepository.save.mockResolvedValue(updatedWarehouse);

      const result = await service.update(1, updateDto);

      expect(result.data.name).toBe('Updated Distribution Center');
    });
  });

  describe('remove', () => {
    it('should delete a warehouse', async () => {
      const mockWarehouse = { 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan'
      };

      mockRepository.findOne.mockResolvedValue(mockWarehouse);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBe('success.WAREHOUSE.DELETED');
    });
  });

  describe('findWarehousesByNamePattern', () => {
    it('should return warehouses matching name pattern', async () => {
      const mockWarehouses = [{ 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan'
      }];

      mockRepository.find.mockResolvedValue(mockWarehouses);

      const result = await service.findWarehousesByNamePattern('main');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Main Distribution Center');
    });
  });

  describe('findWarehousesByAddressPattern', () => {
    it('should return warehouses matching address pattern', async () => {
      const mockWarehouses = [{ 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan'
      }];

      mockRepository.find.mockResolvedValue(mockWarehouses);

      const result = await service.findWarehousesByAddressPattern('industrial');

      expect(result).toHaveLength(1);
      expect(result[0].address).toBe('123 Industrial Blvd, Tashkent, Uzbekistan');
    });
  });

  describe('findAllOrderedByName', () => {
    it('should return all warehouses ordered by name', async () => {
      const mockWarehouses = [
        { 
          id: 1, 
          name: 'Central Storage Facility',
          address: '987 Warehouse Drive, Navoiy, Uzbekistan'
        },
        { 
          id: 2, 
          name: 'Main Distribution Center',
          address: '123 Industrial Blvd, Tashkent, Uzbekistan'
        },
      ];

      mockRepository.find.mockResolvedValue(mockWarehouses);

      const result = await service.findAllOrderedByName();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Central Storage Facility');
    });
  });

  describe('warehouseExists', () => {
    it('should return true if warehouse exists', async () => {
      const mockWarehouse = { 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan'
      };

      mockRepository.findOne.mockResolvedValue(mockWarehouse);

      const result = await service.warehouseExists('Main Distribution Center');

      expect(result).toBe(true);
    });

    it('should return false if warehouse does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.warehouseExists('NonExistent');

      expect(result).toBe(false);
    });
  });

  describe('getWarehousesCount', () => {
    it('should return total count of warehouses', async () => {
      mockRepository.count.mockResolvedValue(15);

      const result = await service.getWarehousesCount();

      expect(result).toBe(15);
    });
  });

  describe('searchWarehouses', () => {
    it('should return warehouses matching search criteria', async () => {
      const mockWarehouses = [{ 
        id: 1, 
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan'
      }];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockWarehouses),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.searchWarehouses({ name: 'main' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Main Distribution Center');
    });
  });
});
