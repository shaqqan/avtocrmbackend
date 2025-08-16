import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AutoModelService } from './auto-model.service';
import { AutoModels, AutoBrand } from 'src/databases/typeorm/entities';
import { CreateAutoModelDto } from './dto/request/create-auto-model.dto';
import { UpdateAutoModelDto } from './dto/request/update-auto-model.dto';

describe('AutoModelService', () => {
  let service: AutoModelService;
  let modelRepository: Repository<AutoModels>;
  let brandRepository: Repository<AutoBrand>;
  let i18nService: I18nService;

  const mockModelRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    softDelete: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockBrandRepository = {
    findOne: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoModelService,
        {
          provide: getRepositoryToken(AutoModels),
          useValue: mockModelRepository,
        },
        {
          provide: getRepositoryToken(AutoBrand),
          useValue: mockBrandRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<AutoModelService>(AutoModelService);
    modelRepository = module.get<Repository<AutoModels>>(getRepositoryToken(AutoModels));
    brandRepository = module.get<Repository<AutoBrand>>(getRepositoryToken(AutoBrand));
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new auto model', async () => {
      const createDto: CreateAutoModelDto = { name: 'Camry', brandId: 1 };
      const mockBrand = { id: 1, name: 'Toyota' };
      const mockModel = { id: 1, name: 'Camry', brandId: 1 };
      const mockModelWithBrand = { ...mockModel, brand: mockBrand };

      mockBrandRepository.findOne.mockResolvedValue(mockBrand);
      mockModelRepository.findOne.mockResolvedValue(null);
      mockModelRepository.create.mockReturnValue(mockModel);
      mockModelRepository.save.mockResolvedValue(mockModel);
      mockModelRepository.findOne.mockResolvedValue(mockModelWithBrand);

      const result = await service.create(createDto);

      expect(result.data.name).toBe('Camry');
      expect(mockModelRepository.create).toHaveBeenCalledWith({ name: 'Camry', brandId: 1 });
    });

    it('should throw error if brand not found', async () => {
      const createDto: CreateAutoModelDto = { name: 'Camry', brandId: 999 };

      mockBrandRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow();
    });

    it('should throw error if model name already exists for brand', async () => {
      const createDto: CreateAutoModelDto = { name: 'Camry', brandId: 1 };
      const mockBrand = { id: 1, name: 'Toyota' };
      const existingModel = { id: 1, name: 'Camry', brandId: 1 };

      mockBrandRepository.findOne.mockResolvedValue(mockBrand);
      mockModelRepository.findOne.mockResolvedValue(existingModel);

      await expect(service.create(createDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated models', async () => {
      const mockModels = [{ id: 1, name: 'Camry', brandId: 1, brand: { id: 1, name: 'Toyota' } }];
      const mockTotal = 1;

      mockModelRepository.findAndCount.mockResolvedValue([mockModels, mockTotal]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a model by id', async () => {
      const mockModel = { id: 1, name: 'Camry', brandId: 1, brand: { id: 1, name: 'Toyota' } };

      mockModelRepository.findOne.mockResolvedValue(mockModel);

      const result = await service.findOne(1);

      expect(result.name).toBe('Camry');
    });

    it('should throw error if model not found', async () => {
      mockModelRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a model', async () => {
      const updateDto: UpdateAutoModelDto = { id: 1, name: 'Camry Hybrid' };
      const existingModel = { id: 1, name: 'Camry', brandId: 1, brand: { id: 1, name: 'Toyota' } };
      const updatedModel = { ...existingModel, name: 'Camry Hybrid' };

      mockModelRepository.findOne.mockResolvedValueOnce(existingModel);
      mockModelRepository.findOne.mockResolvedValueOnce(null); // No duplicate name
      mockModelRepository.save.mockResolvedValue(updatedModel);
      mockModelRepository.findOne.mockResolvedValue(updatedModel);

      const result = await service.update(1, updateDto);

      expect(result.data.name).toBe('Camry Hybrid');
    });
  });

  describe('remove', () => {
    it('should delete a model', async () => {
      const mockModel = { id: 1, name: 'Camry', brandId: 1 };

      mockModelRepository.findOne.mockResolvedValue(mockModel);
      mockModelRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBe('success.AUTO_MODEL.DELETED');
    });
  });

  describe('findModelsByBrand', () => {
    it('should return models for a specific brand', async () => {
      const mockModels = [{ id: 1, name: 'Camry', brandId: 1, brand: { id: 1, name: 'Toyota' } }];

      mockModelRepository.find.mockResolvedValue(mockModels);

      const result = await service.findModelsByBrand(1);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Camry');
    });
  });
});
