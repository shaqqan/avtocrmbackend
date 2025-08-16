import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AutoPositionService } from './auto-position.service';
import { AutoPosition, AutoModels } from 'src/databases/typeorm/entities';
import { CreateAutoPositionDto } from './dto/request/create-auto-position.dto';
import { UpdateAutoPositionDto } from './dto/request/update-auto-position.dto';
import { SortOrder } from 'src/common/dto/request/base-pagination.dto';

describe('AutoPositionService', () => {
  let service: AutoPositionService;
  let positionRepository: Repository<AutoPosition>;
  let autoModelRepository: Repository<AutoModels>;
  let i18nService: I18nService;

  const mockPositionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    softDelete: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  };

  const mockAutoModelRepository = {
    findOne: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoPositionService,
        {
          provide: getRepositoryToken(AutoPosition),
          useValue: mockPositionRepository,
        },
        {
          provide: getRepositoryToken(AutoModels),
          useValue: mockAutoModelRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<AutoPositionService>(AutoPositionService);
    positionRepository = module.get<Repository<AutoPosition>>(getRepositoryToken(AutoPosition));
    autoModelRepository = module.get<Repository<AutoModels>>(getRepositoryToken(AutoModels));
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new auto position', async () => {
      const createDto: CreateAutoPositionDto = { name: 'Front Left', autoModelId: 1 };
      const mockAutoModel = { id: 1, name: 'Camry' };
      const mockPosition = { id: 1, name: 'Front Left', autoModelId: 1 };
      const mockPositionWithModel = { ...mockPosition, autoModel: mockAutoModel };

      mockAutoModelRepository.findOne.mockResolvedValue(mockAutoModel);
      mockPositionRepository.findOne.mockResolvedValue(null);
      mockPositionRepository.create.mockReturnValue(mockPosition);
      mockPositionRepository.save.mockResolvedValue(mockPosition);
      mockPositionRepository.findOne.mockResolvedValue(mockPositionWithModel);

      const result = await service.create(createDto);

      expect(result.data.name).toBe('Front Left');
      expect(result.data.autoModelId).toBe(1);
      expect(mockPositionRepository.create).toHaveBeenCalledWith({ name: 'Front Left', autoModelId: 1 });
    });

    it('should throw error if auto model not found', async () => {
      const createDto: CreateAutoPositionDto = { name: 'Front Left', autoModelId: 999 };

      mockAutoModelRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow();
    });

    it('should throw error if position name already exists for auto model', async () => {
      const createDto: CreateAutoPositionDto = { name: 'Front Left', autoModelId: 1 };
      const mockAutoModel = { id: 1, name: 'Camry' };
      const existingPosition = { id: 1, name: 'Front Left', autoModelId: 1 };

      mockAutoModelRepository.findOne.mockResolvedValue(mockAutoModel);
      mockPositionRepository.findOne.mockResolvedValue(existingPosition);

      await expect(service.create(createDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated positions', async () => {
      const mockPositions = [{ 
        id: 1, 
        name: 'Front Left', 
        autoModelId: 1,
        autoModel: { id: 1, name: 'Camry', brand: { id: 1, name: 'Toyota' } }
      }];
      const mockTotal = 1;

      mockPositionRepository.findAndCount.mockResolvedValue([mockPositions, mockTotal]);

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
    it('should return a position by id', async () => {
      const mockPosition = { 
        id: 1, 
        name: 'Front Left', 
        autoModelId: 1,
        autoModel: { id: 1, name: 'Camry', brand: { id: 1, name: 'Toyota' } }
      };

      mockPositionRepository.findOne.mockResolvedValue(mockPosition);

      const result = await service.findOne(1);

      expect(result.name).toBe('Front Left');
      expect(result.autoModelId).toBe(1);
    });

    it('should throw error if position not found', async () => {
      mockPositionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a position', async () => {
      const updateDto: UpdateAutoPositionDto = { id: 1, name: 'Front Left Driver Side' };
      const existingPosition = { id: 1, name: 'Front Left', autoModelId: 1, autoModel: { id: 1, name: 'Camry' } };
      const updatedPosition = { ...existingPosition, name: 'Front Left Driver Side' };

      mockPositionRepository.findOne.mockResolvedValueOnce(existingPosition);
      mockPositionRepository.findOne.mockResolvedValueOnce(null); // No duplicate name
      mockPositionRepository.save.mockResolvedValue(updatedPosition);
      mockPositionRepository.findOne.mockResolvedValue(updatedPosition);

      const result = await service.update(1, updateDto);

      expect(result.data.name).toBe('Front Left Driver Side');
    });
  });

  describe('remove', () => {
    it('should delete a position', async () => {
      const mockPosition = { id: 1, name: 'Front Left', autoModelId: 1 };

      mockPositionRepository.findOne.mockResolvedValue(mockPosition);
      mockPositionRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBe('success.AUTO_POSITION.DELETED');
    });
  });

  describe('findPositionsByAutoModel', () => {
    it('should return positions for a specific auto model', async () => {
      const mockPositions = [{ 
        id: 1, 
        name: 'Front Left', 
        autoModelId: 1,
        autoModel: { id: 1, name: 'Camry', brand: { id: 1, name: 'Toyota' } }
      }];

      mockPositionRepository.find.mockResolvedValue(mockPositions);

      const result = await service.findPositionsByAutoModel(1);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Front Left');
      expect(result[0].autoModelId).toBe(1);
    });
  });

  describe('findPositionsByNamePattern', () => {
    it('should return positions matching pattern', async () => {
      const mockPositions = [{ 
        id: 1, 
        name: 'Front Left', 
        autoModelId: 1,
        autoModel: { id: 1, name: 'Camry', brand: { id: 1, name: 'Toyota' } }
      }];

      mockPositionRepository.find.mockResolvedValue(mockPositions);

      const result = await service.findPositionsByNamePattern('front');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Front Left');
    });
  });

  describe('findAllOrderedByName', () => {
    it('should return all positions ordered by name', async () => {
      const mockPositions = [
        { 
          id: 1, 
          name: 'Center Front', 
          autoModelId: 1,
          autoModel: { id: 1, name: 'Camry', brand: { id: 1, name: 'Toyota' } }
        },
        { 
          id: 2, 
          name: 'Front Left', 
          autoModelId: 1,
          autoModel: { id: 1, name: 'Camry', brand: { id: 1, name: 'Toyota' } }
        },
      ];

      mockPositionRepository.find.mockResolvedValue(mockPositions);

      const result = await service.findAllOrderedByName();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Center Front');
    });
  });

  describe('positionExists', () => {
    it('should return true if position exists', async () => {
      const mockPosition = { id: 1, name: 'Front Left', autoModelId: 1 };

      mockPositionRepository.findOne.mockResolvedValue(mockPosition);

      const result = await service.positionExists('Front Left', 1);

      expect(result).toBe(true);
    });

    it('should return false if position does not exist', async () => {
      mockPositionRepository.findOne.mockResolvedValue(null);

      const result = await service.positionExists('NonExistent', 1);

      expect(result).toBe(false);
    });
  });

  describe('getPositionsCount', () => {
    it('should return total count of positions', async () => {
      mockPositionRepository.count.mockResolvedValue(35);

      const result = await service.getPositionsCount();

      expect(result).toBe(35);
    });
  });

  describe('getPositionsCountByAutoModel', () => {
    it('should return count of positions for a specific auto model', async () => {
      mockPositionRepository.count.mockResolvedValue(5);

      const result = await service.getPositionsCountByAutoModel(1);

      expect(result).toBe(5);
    });
  });
});
