import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Order, OrderState, Customer, AutoModels, AutoPosition, AutoColor } from 'src/databases/typeorm/entities';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { I18nService } from 'nestjs-i18n';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SortOrder } from 'src/common/dto/request/base-pagination.dto';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let customerRepository: Repository<Customer>;
  let autoModelRepository: Repository<AutoModels>;
  let autoPositionRepository: Repository<AutoPosition>;
  let autoColorRepository: Repository<AutoColor>;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockCustomerRepository = {
    findOne: jest.fn(),
  };

  const mockAutoModelRepository = {
    findOne: jest.fn(),
  };

  const mockAutoPositionRepository = {
    findOne: jest.fn(),
  };

  const mockAutoColorRepository = {
    findOne: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        {
          provide: getRepositoryToken(AutoModels),
          useValue: mockAutoModelRepository,
        },
        {
          provide: getRepositoryToken(AutoPosition),
          useValue: mockAutoPositionRepository,
        },
        {
          provide: getRepositoryToken(AutoColor),
          useValue: mockAutoColorRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    customerRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
    autoModelRepository = module.get<Repository<AutoModels>>(getRepositoryToken(AutoModels));
    autoPositionRepository = module.get<Repository<AutoPosition>>(getRepositoryToken(AutoPosition));
    autoColorRepository = module.get<Repository<AutoColor>>(getRepositoryToken(AutoColor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createDto: CreateOrderDto = {
        customerId: 1,
        autoModelId: 1,
        autoPositionId: 1,
        autoColorId: 1,
        contractCode: 'CONTRACT-2024-001',
        queueNumber: 1,
        amountDue: 5000.00,
        orderDate: '2024-01-15',
        price: 25000.00,
        expectedDeliveryDate: '2024-03-15',
        paidPercentage: 25.0,
      };

      const mockOrder = { id: 1, ...createDto };
      const mockOrderWithRelations = { id: 1, ...createDto, customer: {}, autoModel: {}, autoPosition: {}, autoColor: {} };

      // Mock the sequence of findOne calls in the create method
      mockOrderRepository.findOne
        .mockResolvedValueOnce(null) // Contract code check
        .mockResolvedValueOnce(mockOrderWithRelations); // Fetch with relations after save
      mockCustomerRepository.findOne.mockResolvedValue({ id: 1 });
      mockAutoModelRepository.findOne.mockResolvedValue({ id: 1 });
      mockAutoPositionRepository.findOne.mockResolvedValue({ id: 1 });
      mockAutoColorRepository.findOne.mockResolvedValue({ id: 1 });
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      const result = await service.create(createDto);

      expect(result.data).toBeDefined();
      expect(result.data.contractCode).toBe(createDto.contractCode);
      expect(mockOrderRepository.save).toHaveBeenCalled();
    });

    it('should throw error if contract code already exists', async () => {
      const createDto: CreateOrderDto = {
        customerId: 1,
        autoModelId: 1,
        autoPositionId: 1,
        autoColorId: 1,
        contractCode: 'CONTRACT-2024-001',
        queueNumber: 1,
        amountDue: 5000.00,
        orderDate: '2024-01-15',
        price: 25000.00,
        expectedDeliveryDate: '2024-03-15',
        paidPercentage: 25.0,
      };

      const existingOrder = { id: 1, contractCode: 'CONTRACT-2024-001' };

      mockOrderRepository.findOne.mockResolvedValue(existingOrder);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
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

      const mockOrders = [
        { id: 1, contractCode: 'CONTRACT-2024-001', state: OrderState.NEW },
        { id: 2, contractCode: 'CONTRACT-2024-002', state: OrderState.ON_THE_WAY },
      ];

      mockOrderRepository.findAndCount.mockResolvedValue([mockOrders, 2]);

      const result = await service.findAll(mockPaginationDto);

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return an order by ID', async () => {
      const mockOrder = {
        id: 1,
        contractCode: 'CONTRACT-2024-001',
        state: OrderState.NEW,
        customer: {},
        autoModel: {},
        autoPosition: {},
        autoColor: {},
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.contractCode).toBe('CONTRACT-2024-001');
    });

    it('should throw error if order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateDto: UpdateOrderDto = {
        id: 1,
        contractCode: 'CONTRACT-2024-001-UPDATED',
      };

      const existingOrder = {
        id: 1,
        contractCode: 'CONTRACT-2024-001',
        state: OrderState.NEW,
      };

      const updatedOrder = { ...existingOrder, ...updateDto };

      mockOrderRepository.findOne
        .mockResolvedValueOnce(existingOrder)
        .mockResolvedValueOnce(null); // For contract code uniqueness check
      mockOrderRepository.save.mockResolvedValue(updatedOrder);
      mockOrderRepository.findOne.mockResolvedValue({ ...updatedOrder, customer: {}, autoModel: {}, autoPosition: {}, autoColor: {} }); // Fetch with relations

      const result = await service.update(1, updateDto);

      expect(result.data.contractCode).toBe(updateDto.contractCode);
      expect(mockOrderRepository.save).toHaveBeenCalled();
    });

    it('should throw error if order not found for update', async () => {
      const updateDto: UpdateOrderDto = {
        id: 999,
        contractCode: 'CONTRACT-2024-001-UPDATED',
      };

      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete an order', async () => {
      const mockOrder = { id: 1, contractCode: 'CONTRACT-2024-001' };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.message).toBeDefined();
      expect(mockOrderRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw error if order not found for deletion', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
