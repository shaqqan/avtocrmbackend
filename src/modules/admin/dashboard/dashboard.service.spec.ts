import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DashboardService } from './dashboard.service';
import { Order, OrderState, AutoModels, Stock, StockStatus, Customer } from 'src/databases/typeorm/entities';

describe('DashboardService', () => {
  let service: DashboardService;
  let orderRepository: Repository<Order>;
  let autoModelRepository: Repository<AutoModels>;
  let stockRepository: Repository<Stock>;
  let customerRepository: Repository<Customer>;

  const mockOrderRepository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockAutoModelRepository = {
    find: jest.fn(),
  };

  const mockStockRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockCustomerRepository = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(AutoModels),
          useValue: mockAutoModelRepository,
        },
        {
          provide: getRepositoryToken(Stock),
          useValue: mockStockRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    autoModelRepository = module.get<Repository<AutoModels>>(getRepositoryToken(AutoModels));
    stockRepository = module.get<Repository<Stock>>(getRepositoryToken(Stock));
    customerRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCarSalesStatistics', () => {
    it('should return weekly statistics for date range up to 31 days', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      const mockOrders = [
        { orderDate: new Date('2024-01-05'), price: 25000.00 },
        { orderDate: new Date('2024-01-12'), price: 30000.00 },
        { orderDate: new Date('2024-01-19'), price: 28000.00 },
        { orderDate: new Date('2024-01-26'), price: 32000.00 },
      ];

      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.getCarSalesStatistics(startDate, endDate);

      expect(result.metadata.interval).toBe('weekly');
      expect(result.data).toBeDefined();
      expect(result.summary.totalSales).toBe(4);
      expect(result.summary.totalRevenue).toBe(115000.00);
      expect(mockOrderRepository.find).toHaveBeenCalledWith({
        where: {
          state: OrderState.DELIVERED,
          orderDate: Between(startDate, endDate),
        },
        select: ['orderDate', 'price'],
      });
    });

    it('should return monthly statistics for date range longer than 31 days', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      
      const mockOrders = [
        { orderDate: new Date('2024-01-15'), price: 25000.00 },
        { orderDate: new Date('2024-02-20'), price: 30000.00 },
        { orderDate: new Date('2024-03-10'), price: 28000.00 },
        { orderDate: new Date('2024-04-05'), price: 32000.00 },
      ];

      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.getCarSalesStatistics(startDate, endDate);

      expect(result.metadata.interval).toBe('monthly');
      expect(result.data).toBeDefined();
      expect(result.summary.totalSales).toBe(4);
      expect(result.summary.totalRevenue).toBe(115000.00);
    });

    it('should handle empty orders list', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      mockOrderRepository.find.mockResolvedValue([]);

      const result = await service.getCarSalesStatistics(startDate, endDate);

      // The service returns periods with zero counts even when there are no orders
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.every(item => item.count === 0 && item.revenue === 0)).toBe(true);
      expect(result.summary.totalSales).toBe(0);
      expect(result.summary.totalRevenue).toBe(0);
      expect(result.summary.averageSalesPerPeriod).toBe(0);
      expect(result.summary.averageRevenuePerPeriod).toBe(0);
    });

    it('should calculate correct averages', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      const mockOrders = [
        { orderDate: new Date('2024-01-05'), price: 20000.00 },
        { orderDate: new Date('2024-01-12'), price: 30000.00 },
        { orderDate: new Date('2024-01-19'), price: 40000.00 },
      ];

      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.getCarSalesStatistics(startDate, endDate);

      expect(result.summary.totalSales).toBe(3);
      expect(result.summary.totalRevenue).toBe(90000.00);
      expect(result.summary.averageSalesPerPeriod).toBeGreaterThan(0);
      expect(result.summary.averageRevenuePerPeriod).toBeGreaterThan(0);
    });
  });

  describe('getCarSalesByModel', () => {
    it('should return car sales statistics grouped by model', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      
      const mockOrders = [
        {
          id: 1,
          price: 25000.00,
          autoModel: {
            id: 1,
            name: 'Camry',
            brand: { id: 1, name: 'Toyota' }
          }
        },
        {
          id: 2,
          price: 30000.00,
          autoModel: {
            id: 1,
            name: 'Camry',
            brand: { id: 1, name: 'Toyota' }
          }
        },
        {
          id: 3,
          price: 28000.00,
          autoModel: {
            id: 2,
            name: 'Civic',
            brand: { id: 2, name: 'Honda' }
          }
        },
        {
          id: 4,
          price: 32000.00,
          autoModel: {
            id: 3,
            name: 'Accord',
            brand: { id: 2, name: 'Honda' }
          }
        },
      ];

      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.getCarSalesByModel(startDate, endDate);

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(3);
      expect(result.summary.totalSales).toBe(4);
      expect(result.summary.totalRevenue).toBe(115000.00);
      expect(result.summary.totalModels).toBe(3);

      // Check that data is sorted by count descending
      expect(result.data[0].count).toBeGreaterThanOrEqual(result.data[1].count);
      expect(result.data[1].count).toBeGreaterThanOrEqual(result.data[2].count);

      // Check specific model data
      const camryData = result.data.find(item => item.modelName === 'Camry');
      expect(camryData).toBeDefined();
      expect(camryData!.count).toBe(2);
      expect(camryData!.revenue).toBe(55000.00);
      expect(camryData!.percentage).toBe(50.0);

      expect(mockOrderRepository.find).toHaveBeenCalledWith({
        where: {
          state: OrderState.DELIVERED,
          orderDate: Between(startDate, endDate),
        },
        relations: ['autoModel', 'autoModel.brand'],
        select: ['id', 'price', 'autoModel'],
      });
    });

    it('should handle orders without auto model relations', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      
      const mockOrders = [
        {
          id: 1,
          price: 25000.00,
          autoModel: null
        },
        {
          id: 2,
          price: 30000.00,
          autoModel: {
            id: 1,
            name: 'Camry',
            brand: { id: 1, name: 'Toyota' }
          }
        },
      ];

      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.getCarSalesByModel(startDate, endDate);

      expect(result.data.length).toBe(1);
      expect(result.summary.totalSales).toBe(2);
      expect(result.summary.totalRevenue).toBe(55000.00);
      expect(result.summary.totalModels).toBe(1);
    });

    it('should handle empty orders list', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      
      mockOrderRepository.find.mockResolvedValue([]);

      const result = await service.getCarSalesByModel(startDate, endDate);

      expect(result.data).toEqual([]);
      expect(result.summary.totalSales).toBe(0);
      expect(result.summary.totalRevenue).toBe(0);
      expect(result.summary.totalModels).toBe(0);
      expect(result.summary.averageSalesPerModel).toBe(0);
      expect(result.summary.averageRevenuePerModel).toBe(0);
    });

    it('should calculate correct percentages and averages', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      
      const mockOrders = [
        {
          id: 1,
          price: 20000.00,
          autoModel: {
            id: 1,
            name: 'Model A',
            brand: { id: 1, name: 'Brand A' }
          }
        },
        {
          id: 2,
          price: 30000.00,
          autoModel: {
            id: 1,
            name: 'Model A',
            brand: { id: 1, name: 'Brand A' }
          }
        },
        {
          id: 3,
          price: 40000.00,
          autoModel: {
            id: 2,
            name: 'Model B',
            brand: { id: 2, name: 'Brand B' }
          }
        },
      ];

      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.getCarSalesByModel(startDate, endDate);

      expect(result.summary.totalSales).toBe(3);
      expect(result.summary.totalRevenue).toBe(90000.00);
      expect(result.summary.totalModels).toBe(2);
      expect(result.summary.averageSalesPerModel).toBe(1.5);
      expect(result.summary.averageRevenuePerModel).toBe(45000.00);

      // Check percentages
      const modelAData = result.data.find(item => item.modelName === 'Model A');
      expect(modelAData!.percentage).toBe(66.67); // 2 out of 3 sales = 66.67%

      const modelBData = result.data.find(item => item.modelName === 'Model B');
      expect(modelBData!.percentage).toBe(33.33); // 1 out of 3 sales = 33.33%
    });
  });

  describe('getComprehensiveStatistics', () => {
    it('should return comprehensive business statistics', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      // Mock stock repository
      const mockStockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { status: StockStatus.AVAILABLE, count: '150' },
          { status: StockStatus.RESERVED, count: '25' },
          { status: StockStatus.SOLD, count: '75' },
        ]),
      };
      mockStockRepository.createQueryBuilder.mockReturnValue(mockStockQueryBuilder);

      // Mock customer repository
      mockCustomerRepository.count
        .mockResolvedValueOnce(500) // totalCustomers
        .mockResolvedValueOnce(45); // newCustomersInPeriod

      // Mock order repository
      const mockOrderQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { state: OrderState.DELIVERED, count: '75', totalPrice: '1875000.00', totalPaidPercentage: '1875.00', totalAmountDue: '1406250.00' },
          { state: OrderState.NEW, count: '25', totalPrice: '625000.00', totalPaidPercentage: '125.00', totalAmountDue: '468750.00' },
        ]),
      };
      mockOrderRepository.createQueryBuilder.mockReturnValue(mockOrderQueryBuilder);

      const mockOrdersInPeriod = [
        { state: OrderState.DELIVERED, price: 25000.00, paidPercentage: 25.0, amountDue: 18750.00 },
        { state: OrderState.DELIVERED, price: 30000.00, paidPercentage: 30.0, amountDue: 21000.00 },
        { state: OrderState.NEW, price: 20000.00, paidPercentage: 10.0, amountDue: 18000.00 },
      ];
      mockOrderRepository.find.mockResolvedValue(mockOrdersInPeriod);

      const result = await service.getComprehensiveStatistics(startDate, endDate);

      // Verify stock metrics
      expect(result.stockMetrics.totalCarsAvailable).toBe(150);
      expect(result.stockMetrics.totalCarsReserved).toBe(25);
      expect(result.stockMetrics.totalCarsSold).toBe(75);
      expect(result.stockMetrics.totalCarsInStock).toBe(250);

      // Verify customer metrics
      expect(result.customerMetrics.totalCustomers).toBe(500);
      expect(result.customerMetrics.newCustomersInPeriod).toBe(45);

      // Verify sales metrics
      expect(result.salesMetrics.totalCarsSold).toBe(2); // Only DELIVERED orders
      expect(result.salesMetrics.totalSalesAmount).toBe(55000.00);
      expect(result.salesMetrics.totalInitialPayments).toBe(15250.00); // 25% of 25000 + 30% of 30000 = 6250 + 9000 = 15250
      expect(result.salesMetrics.totalOutstandingAmount).toBe(39750.00); // 18750 + 21000
      expect(result.salesMetrics.averagePaymentPercentage).toBe(27.5); // (25 + 30) / 2

      // Verify metadata
      expect(result.metadata.startDate).toEqual(startDate);
      expect(result.metadata.endDate).toEqual(endDate);
      expect(result.metadata.generatedAt).toBeInstanceOf(Date);
    });

    it('should handle empty data gracefully', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      // Mock empty stock data
      const mockStockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      mockStockRepository.createQueryBuilder.mockReturnValue(mockStockQueryBuilder);

      // Mock empty customer data
      mockCustomerRepository.count
        .mockResolvedValueOnce(0) // totalCustomers
        .mockResolvedValueOnce(0); // newCustomersInPeriod

      // Mock empty order data
      const mockOrderQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      mockOrderRepository.createQueryBuilder.mockReturnValue(mockOrderQueryBuilder);
      mockOrderRepository.find.mockResolvedValue([]);

      const result = await service.getComprehensiveStatistics(startDate, endDate);

      // Verify all metrics are zero
      expect(result.stockMetrics.totalCarsAvailable).toBe(0);
      expect(result.stockMetrics.totalCarsReserved).toBe(0);
      expect(result.stockMetrics.totalCarsSold).toBe(0);
      expect(result.stockMetrics.totalCarsInStock).toBe(0);
      expect(result.customerMetrics.totalCustomers).toBe(0);
      expect(result.customerMetrics.newCustomersInPeriod).toBe(0);
      expect(result.salesMetrics.totalCarsSold).toBe(0);
      expect(result.salesMetrics.totalSalesAmount).toBe(0);
      expect(result.salesMetrics.totalInitialPayments).toBe(0);
      expect(result.salesMetrics.totalOutstandingAmount).toBe(0);
      expect(result.salesMetrics.averagePaymentPercentage).toBe(0);
    });
  });
});
