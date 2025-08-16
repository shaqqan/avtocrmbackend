import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { Customer } from 'src/databases/typeorm/entities';
import { CreateCustomerDto } from './dto/request/create-customer.dto';
import { UpdateCustomerDto } from './dto/request/update-customer.dto';
import { I18nService } from 'nestjs-i18n';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SortOrder } from 'src/common/dto/request/base-pagination.dto';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: Repository<Customer>;

  const mockCustomerRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const createDto: CreateCustomerDto = {
        pinfl: 12345678901234,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+998901234567',
      };

      const mockCustomer = { id: 1, ...createDto };

      mockCustomerRepository.findOne.mockResolvedValue(null);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const result = await service.create(createDto);

      expect(result.data).toBeDefined();
      expect(result.data.pinfl).toBe(createDto.pinfl);
      expect(mockCustomerRepository.save).toHaveBeenCalled();
    });

    it('should throw error if PINFL already exists', async () => {
      const createDto: CreateCustomerDto = {
        pinfl: 12345678901234,
        firstName: 'John',
        lastName: 'Doe',
      };

      const existingCustomer = { id: 1, pinfl: 12345678901234 };

      mockCustomerRepository.findOne.mockResolvedValue(existingCustomer);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
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

      const mockCustomers = [
        { id: 1, pinfl: 12345678901234, firstName: 'John' },
        { id: 2, pinfl: 23456789012345, firstName: 'Jane' },
      ];

      mockCustomerRepository.findAndCount.mockResolvedValue([mockCustomers, 2]);

      const result = await service.findAll(mockPaginationDto);

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      const mockCustomer = {
        id: 1,
        pinfl: 12345678901234,
        firstName: 'John',
        lastName: 'Doe',
      };

      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.pinfl).toBe(12345678901234);
    });

    it('should throw error if customer not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateDto: UpdateCustomerDto = {
        id: 1,
        firstName: 'John Updated',
      };

      const existingCustomer = {
        id: 1,
        pinfl: 12345678901234,
        firstName: 'John',
        lastName: 'Doe',
      };

      const updatedCustomer = { ...existingCustomer, ...updateDto };

      mockCustomerRepository.findOne
        .mockResolvedValueOnce(existingCustomer)
        .mockResolvedValueOnce(null); // For PINFL uniqueness check
      mockCustomerRepository.save.mockResolvedValue(updatedCustomer);

      const result = await service.update(1, updateDto);

      expect(result.data.firstName).toBe(updateDto.firstName);
      expect(mockCustomerRepository.save).toHaveBeenCalled();
    });

    it('should throw error if customer not found for update', async () => {
      const updateDto: UpdateCustomerDto = {
        id: 999,
        firstName: 'John Updated',
      };

      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a customer', async () => {
      const mockCustomer = { id: 1, pinfl: 12345678901234, firstName: 'John' };

      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockCustomerRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBeDefined();
      expect(mockCustomerRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw error if customer not found for deletion', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
