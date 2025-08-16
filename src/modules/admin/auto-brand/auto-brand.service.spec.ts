import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AutoBrandService } from './auto-brand.service';
import { AutoBrand } from 'src/databases/typeorm/entities';
import { CreateAutoBrandDto } from './dto/request/create-auto-brand.dto';
import { UpdateAutoBrandDto } from './dto/request/update-auto-brand.dto';

describe('AutoBrandService', () => {
  let service: AutoBrandService;
  let repository: Repository<AutoBrand>;
  let i18nService: I18nService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoBrandService,
        {
          provide: getRepositoryToken(AutoBrand),
          useValue: mockRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<AutoBrandService>(AutoBrandService);
    repository = module.get<Repository<AutoBrand>>(getRepositoryToken(AutoBrand));
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new auto brand', async () => {
      const createDto: CreateAutoBrandDto = { name: 'Toyota' };
      const mockBrand = { id: 1, name: 'Toyota', models: [] };
      const mockBrandWithModels = { ...mockBrand, models: [] };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBrand);
      mockRepository.save.mockResolvedValue(mockBrand);
      mockRepository.findOne.mockResolvedValue(mockBrandWithModels);

      const result = await service.create(createDto);

      expect(result.data.name).toBe('Toyota');
      expect(mockRepository.create).toHaveBeenCalledWith({ name: 'Toyota' });
    });

    it('should throw error if brand name already exists', async () => {
      const createDto: CreateAutoBrandDto = { name: 'Toyota' };
      const existingBrand = { id: 1, name: 'Toyota' };

      mockRepository.findOne.mockResolvedValue(existingBrand);

      await expect(service.create(createDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated brands', async () => {
      const mockBrands = [{ id: 1, name: 'Toyota', models: [] }];
      const mockTotal = 1;

      mockRepository.findAndCount.mockResolvedValue([mockBrands, mockTotal]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a brand by id', async () => {
      const mockBrand = { id: 1, name: 'Toyota', models: [] };

      mockRepository.findOne.mockResolvedValue(mockBrand);

      const result = await service.findOne(1);

      expect(result.name).toBe('Toyota');
    });

    it('should throw error if brand not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a brand', async () => {
      const updateDto: UpdateAutoBrandDto = { id: 1, name: 'Toyota Motors' };
      const existingBrand = { id: 1, name: 'Toyota', models: [] };
      const updatedBrand = { ...existingBrand, name: 'Toyota Motors' };

      mockRepository.findOne.mockResolvedValueOnce(existingBrand);
      mockRepository.findOne.mockResolvedValueOnce(null); // No duplicate name
      mockRepository.save.mockResolvedValue(updatedBrand);
      mockRepository.findOne.mockResolvedValue(updatedBrand);

      const result = await service.update(1, updateDto);

      expect(result.data.name).toBe('Toyota Motors');
    });
  });

  describe('remove', () => {
    it('should delete a brand', async () => {
      const mockBrand = { id: 1, name: 'Toyota', models: [] };

      mockRepository.findOne.mockResolvedValue(mockBrand);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBe('success.AUTO_BRAND.DELETED');
    });

    it('should throw error if brand has models', async () => {
      const mockBrand = { id: 1, name: 'Toyota', models: [{ id: 1, name: 'Camry' }] };

      mockRepository.findOne.mockResolvedValue(mockBrand);

      await expect(service.remove(1)).rejects.toThrow();
    });
  });
});
