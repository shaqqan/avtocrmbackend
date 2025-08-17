import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderState, AutoModels, Stock, StockStatus, Customer } from 'src/databases/typeorm/entities';

export interface SalesStatistics {
  period: string;
  count: number; 
  revenue: number;
}

export interface ModelSalesStatistics {
  modelId: number;
  modelName: string;
  brandName: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface DashboardSalesResponse {
  data: SalesStatistics[];
  summary: {
    totalSales: number;
    totalRevenue: number;
    averageSalesPerPeriod: number;
    averageRevenuePerPeriod: number;
  };
  metadata: {
    startDate: Date;
    endDate: Date;
    interval: 'weekly' | 'monthly';
    totalPeriods: number;
  };
}

export interface DashboardModelSalesResponse {
  data: ModelSalesStatistics[];
  summary: {
    totalSales: number;
    totalRevenue: number;
    totalModels: number;
    averageSalesPerModel: number;
    averageRevenuePerModel: number;
  };
  metadata: {
    startDate: Date;
    endDate: Date;
    totalModels: number;
  };
}

export interface ComprehensiveStatistics {
  stockMetrics: {
    totalCarsAvailable: number;
    totalCarsReserved: number;
    totalCarsSold: number;
    totalCarsInStock: number;
  };
  customerMetrics: {
    totalCustomers: number;
    newCustomersInPeriod: number;
  };
  salesMetrics: {
    totalCarsSold: number;
    totalSalesAmount: number;
    totalInitialPayments: number;
    totalOutstandingAmount: number;
    averagePaymentPercentage: number;
  };
  metadata: {
    startDate: Date;
    endDate: Date;
    generatedAt: Date;
  };
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(AutoModels)
    private readonly autoModelRepository: Repository<AutoModels>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getCarSalesStatistics(startDate: Date, endDate: Date): Promise<DashboardSalesResponse> {
    // Calculate the difference in days
    const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Determine if we should use weekly or monthly intervals
    const useWeekly = daysDifference <= 31;
    const interval = useWeekly ? 'weekly' : 'monthly';

    // Get all delivered orders within the date range
    const orders = await this.orderRepository.find({
      where: {
        state: OrderState.DELIVERED,
        orderDate: Between(startDate, endDate),
      },
      select: ['orderDate', 'price'],
    });

    // Group orders by period
    const salesByPeriod = this.groupOrdersByPeriod(orders, startDate, endDate, useWeekly);

    // Calculate summary statistics
    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.price), 0);
    const totalPeriods = salesByPeriod.length;
    const averageSalesPerPeriod = totalPeriods > 0 ? totalSales / totalPeriods : 0;
    const averageRevenuePerPeriod = totalPeriods > 0 ? totalRevenue / totalPeriods : 0;

    return {
      data: salesByPeriod,
      summary: {
        totalSales,
        totalRevenue,
        averageSalesPerPeriod: Math.round(averageSalesPerPeriod * 100) / 100,
        averageRevenuePerPeriod: Math.round(averageRevenuePerPeriod * 100) / 100,
      },
      metadata: {
        startDate,
        endDate,
        interval,
        totalPeriods,
      },
    };
  }

  async getCarSalesByModel(startDate: Date, endDate: Date): Promise<DashboardModelSalesResponse> {
    // Get all delivered orders within the date range with auto model relations
    const orders = await this.orderRepository.find({
      where: {
        state: OrderState.DELIVERED,
        orderDate: Between(startDate, endDate),
      },
      relations: ['autoModel', 'autoModel.brand'],
      select: ['id', 'price', 'autoModel'],
    });

    // Group orders by model
    const modelSalesMap = new Map<number, { count: number; revenue: number; model: AutoModels }>();

    orders.forEach(order => {
      if (order.autoModel) {
        const modelId = order.autoModel.id;
        const existing = modelSalesMap.get(modelId);
        
        if (existing) {
          existing.count += 1;
          existing.revenue += Number(order.price);
        } else {
          modelSalesMap.set(modelId, {
            count: 1,
            revenue: Number(order.price),
            model: order.autoModel,
          });
        }
      }
    });

    // Calculate total sales and revenue for percentage calculations
    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.price), 0);

    // Convert to array and calculate percentages
    const modelSalesData: ModelSalesStatistics[] = Array.from(modelSalesMap.entries())
      .map(([modelId, data]) => ({
        modelId,
        modelName: data.model.name,
        brandName: data.model.brand?.name || 'Unknown Brand',
        count: data.count,
        revenue: Math.round(data.revenue * 100) / 100,
        percentage: totalSales > 0 ? Math.round((data.count / totalSales) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    // Calculate summary statistics
    const totalModels = modelSalesData.length;
    const averageSalesPerModel = totalModels > 0 ? totalSales / totalModels : 0;
    const averageRevenuePerModel = totalModels > 0 ? totalRevenue / totalModels : 0;

    return {
      data: modelSalesData,
      summary: {
        totalSales,
        totalRevenue,
        totalModels,
        averageSalesPerModel: Math.round(averageSalesPerModel * 100) / 100,
        averageRevenuePerModel: Math.round(averageRevenuePerModel * 100) / 100,
      },
      metadata: {
        startDate,
        endDate,
        totalModels,
      },
    };
  }

  async getComprehensiveStatistics(startDate: Date, endDate: Date): Promise<ComprehensiveStatistics> {
    // Get stock statistics
    const stockStats = await this.stockRepository
      .createQueryBuilder('stock')
      .select([
        'stock.status',
        'COUNT(*) as count'
      ])
      .groupBy('stock.status')
      .getRawMany();

    // Get customer statistics
    const totalCustomers = await this.customerRepository.count();
    const newCustomersInPeriod = await this.customerRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    // Get sales statistics within the date range
    const salesStats = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'order.state',
        'COUNT(*) as count',
        'SUM(order.price) as totalPrice',
        'SUM(order.paidPercentage) as totalPaidPercentage',
        'SUM(order.amountDue) as totalAmountDue'
      ])
      .where('order.orderDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('order.state')
      .getRawMany();

    // Get all orders within the date range for detailed calculations
    const ordersInPeriod = await this.orderRepository.find({
      where: {
        orderDate: Between(startDate, endDate),
      },
      select: ['state', 'price', 'paidPercentage', 'amountDue'],
    });

    // Calculate stock metrics
    const stockMetrics = {
      totalCarsAvailable: parseInt(stockStats.find(s => s.status === StockStatus.AVAILABLE)?.count || '0'),
      totalCarsReserved: parseInt(stockStats.find(s => s.status === StockStatus.RESERVED)?.count || '0'),
      totalCarsSold: parseInt(stockStats.find(s => s.status === StockStatus.SOLD)?.count || '0'),
      totalCarsInStock: stockStats.reduce((sum, s) => sum + parseInt(s.count), 0),
    };

    // Calculate sales metrics
    const totalCarsSold = ordersInPeriod.filter(o => o.state === OrderState.DELIVERED).length;
    const totalSalesAmount = ordersInPeriod
      .filter(o => o.state === OrderState.DELIVERED)
      .reduce((sum, o) => sum + Number(o.price), 0);
    
    const totalInitialPayments = ordersInPeriod
      .filter(o => o.state === OrderState.DELIVERED)
      .reduce((sum, o) => sum + (Number(o.price) * Number(o.paidPercentage) / 100), 0);
    
    const totalOutstandingAmount = ordersInPeriod
      .filter(o => o.state === OrderState.DELIVERED)
      .reduce((sum, o) => sum + Number(o.amountDue), 0);

    const averagePaymentPercentage = totalCarsSold > 0 
      ? ordersInPeriod
          .filter(o => o.state === OrderState.DELIVERED)
          .reduce((sum, o) => sum + Number(o.paidPercentage), 0) / totalCarsSold
      : 0;

    const salesMetrics = {
      totalCarsSold,
      totalSalesAmount: Math.round(totalSalesAmount * 100) / 100,
      totalInitialPayments: Math.round(totalInitialPayments * 100) / 100,
      totalOutstandingAmount: Math.round(totalOutstandingAmount * 100) / 100,
      averagePaymentPercentage: Math.round(averagePaymentPercentage * 100) / 100,
    };

    return {
      stockMetrics,
      customerMetrics: {
        totalCustomers,
        newCustomersInPeriod,
      },
      salesMetrics,
      metadata: {
        startDate,
        endDate,
        generatedAt: new Date(),
      },
    };
  }

  private groupOrdersByPeriod(
    orders: Array<{ orderDate: Date; price: number }>,
    startDate: Date,
    endDate: Date,
    useWeekly: boolean,
  ): SalesStatistics[] {
    const salesByPeriod = new Map<string, { count: number; revenue: number }>();

    if (useWeekly) {
      // Group by weeks
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const weekStart = this.getWeekStart(currentDate);
        const weekKey = this.formatWeekKey(weekStart);
        salesByPeriod.set(weekKey, { count: 0, revenue: 0 });
        
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
      }
    } else {
      // Group by months
      const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (currentDate <= endDate) {
        const monthKey = this.formatMonthKey(currentDate);
        salesByPeriod.set(monthKey, { count: 0, revenue: 0 });
        
        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    // Count orders for each period
    orders.forEach(order => {
      // Ensure orderDate is a proper Date object
      const orderDate = order.orderDate instanceof Date ? order.orderDate : new Date(order.orderDate);
      
      // Skip if orderDate is invalid
      if (isNaN(orderDate.getTime())) {
        console.warn('Invalid order date found:', order.orderDate);
        return;
      }

      let periodKey: string;
      
      if (useWeekly) {
        const weekStart = this.getWeekStart(orderDate);
        periodKey = this.formatWeekKey(weekStart);
      } else {
        periodKey = this.formatMonthKey(orderDate);
      }

      if (salesByPeriod.has(periodKey)) {
        const current = salesByPeriod.get(periodKey)!;
        current.count += 1;
        current.revenue += Number(order.price);
        salesByPeriod.set(periodKey, current);
      }
    })

    // Convert to array and sort by period
    const result: SalesStatistics[] = Array.from(salesByPeriod.entries())
      .map(([period, data]) => ({
        period,
        count: data.count,
        revenue: Math.round(data.revenue * 100) / 100,
      }))
      .sort((a, b) => {
        if (useWeekly) {
          return new Date(a.period).getTime() - new Date(b.period).getTime();
        } else {
          return new Date(a.period).getTime() - new Date(b.period).getTime();
        }
      });

    return result;
  }

  private getWeekStart(date: Date): Date {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date provided to getWeekStart');
    }
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(date.getFullYear(), date.getMonth(), diff);
  }

  private formatWeekKey(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date provided to formatWeekKey');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatMonthKey(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date provided to formatMonthKey');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}
