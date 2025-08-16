import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceListService } from './price-list.service';
import { PriceList, AutoModels, AutoColor, AutoPosition } from 'src/databases/typeorm/entities';
import { CreatePriceListDto } from './dto/request/create-price-list.dto';
import { UpdatePriceListDto } from './dto/request/update-price-list.dto';
import { I18nService } from 'nestjs-i18n';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SortOrder } from 'src/common/dto/request/base-pagination.dto';

describe('PriceListService', () => {
  let service: PriceListService;
  let priceListRepository: Repository<PriceList>;
  let autoModelRepository: Repository<AutoModels>;
  let autoColorRepository: Repository<AutoColor>;
  let autoPositionRepository: Repository<AutoPosition>;

  const mockPriceListRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    softDelete: jest.fn(),
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
        PriceListService,
        {
          provide: getRepositoryToken(PriceList),
          useValue: mockPriceListRepository,
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

    service = module.get<PriceListService>(PriceListService);
    priceListRepository = module.get<Repository<PriceList>>(getRepositoryToken(PriceList));
    autoModelRepository = module.get<Repository<AutoModels>>(getRepositoryToken(AutoModels));
    autoColorRepository = module.get<Repository<AutoColor>>(getRepositoryToken(AutoColor));
    autoPositionRepository = module.get<Repository<AutoPosition>>(getRepositoryToken(AutoPosition));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new price list', async () => {
      const createDto: CreatePriceListDto = {
        autoModelId: 1,
        autoColorId: 1,
        autoPositionId: 1,
        basePrice: 20000.00,
        wholesalePrice: 22000.00,
        retailPrice: 25000.00,
        vat: 5000.00,
        margin: 3000.00,
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
        isActive: true,
      };

      const mockPriceList = { id: 1, ...createDto };
      const mockPriceListWithRelations = { id: 1, ...createDto, autoModel: {}, autoColor: {}, autoPosition: {} };

      // Mock the sequence of findOne calls in the create method
      mockPriceListRepository.findOne
        .mockResolvedValueOnce(null) // No existing price list for combination check
        .mockResolvedValueOnce(mockPriceListWithRelations); // Fetch with relations after save
      mockAutoModelRepository.findOne.mockResolvedValue({ id: 1 });
      mockAutoColorRepository.findOne.mockResolvedValue({ id: 1 });
      mockAutoPositionRepository.findOne.mockResolvedValue({ id: 1 });
      mockPriceListRepository.save.mockResolvedValue(mockPriceList);

      const result = await service.create(createDto);

      expect(result.data).toBeDefined();
      expect(result.data.basePrice).toBe(createDto.basePrice);
      expect(mockPriceListRepository.save).toHaveBeenCalled();
    });

    it('should throw error if price list already exists for this combination', async () => {
      const createDto: CreatePriceListDto = {
        autoModelId: 1,
        autoColorId: 1,
        autoPositionId: 1,
        basePrice: 20000.00,
      };

      const existingPriceList = { id: 1, autoModelId: 1, autoColorId: 1, autoPositionId: 1 };

      mockPriceListRepository.findOne.mockResolvedValue(existingPriceList);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated price lists', async () => {
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

      const mockPriceLists = [
        { id: 1, basePrice: 20000.00, isActive: true },
        { id: 2, basePrice: 25000.00, isActive: true },
      ];

      mockPriceListRepository.findAndCount.mockResolvedValue([mockPriceLists, 2]);

      const result = await service.findAll(mockPaginationDto);

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a price list by ID', async () => {
      const mockPriceList = {
        id: 1,
        basePrice: 20000.00,
        isActive: true,
        autoModel: {},
        autoColor: {},
        autoPosition: {},
      };

      mockPriceListRepository.findOne.mockResolvedValue(mockPriceList);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.basePrice).toBe(20000.00);
    });

    it('should throw error if price list not found', async () => {
      mockPriceListRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a price list', async () => {
      const updateDto: UpdatePriceListDto = {
        id: 1,
        basePrice: 25000.00,
      };

      const existingPriceList = {
        id: 1,
        autoModelId: 1,
        autoColorId: 1,
        autoPositionId: 1,
        basePrice: 20000.00,
        isActive: true,
      };

      const updatedPriceList = { ...existingPriceList, ...updateDto };
      const priceListWithRelations = { ...updatedPriceList, autoModel: {}, autoColor: {}, autoPosition: {} };

      // Mock the sequence of findOne calls in the update method
      // Since updateDto doesn't have autoModelId, autoColorId, or autoPositionId, 
      // the uniqueness check won't run, so only 2 findOne calls
      mockPriceListRepository.findOne
        .mockResolvedValueOnce(existingPriceList) // Find existing price list
        .mockResolvedValueOnce(priceListWithRelations); // Fetch with relations after save
      mockPriceListRepository.save.mockResolvedValue(updatedPriceList);

      const result = await service.update(1, updateDto);

      expect(result.data.basePrice).toBe(updateDto.basePrice);
      expect(mockPriceListRepository.save).toHaveBeenCalled();
    });

    it('should throw error if price list not found for update', async () => {
      const updateDto: UpdatePriceListDto = {
        id: 999,
        basePrice: 25000.00,
      };

      mockPriceListRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a price list', async () => {
      const mockPriceList = { id: 1, basePrice: 20000.00 };

      mockPriceListRepository.findOne.mockResolvedValue(mockPriceList);
      mockPriceListRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBeDefined();
      expect(mockPriceListRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw error if price list not found for deletion', async () => {
      mockPriceListRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
