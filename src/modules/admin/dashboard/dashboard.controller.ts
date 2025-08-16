import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService, DashboardSalesResponse, DashboardModelSalesResponse, ComprehensiveStatistics } from './dashboard.service';
import { DashboardSalesDto } from './dto/request/dashboard-sales.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { PermissionsGuard } from 'src/common/guards';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('car-sales-statistics')
  @ApiOperation({ 
    summary: 'Get car sales statistics within a date range',
    description: 'Returns car sales data formatted for line charts. Uses weekly intervals for ranges up to 1 month, monthly intervals for longer ranges.'
  })
  @ApiResponse({
    status: 200,
    description: 'Car sales statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              period: { type: 'string', example: '2024-01-01' },
              count: { type: 'number', example: 5 },
              revenue: { type: 'number', example: 125000.00 }
            }
          }
        },
        summary: {
          type: 'object',
          properties: {
            totalSales: { type: 'number', example: 25 },
            totalRevenue: { type: 'number', example: 625000.00 },
            averageSalesPerPeriod: { type: 'number', example: 5.0 },
            averageRevenuePerPeriod: { type: 'number', example: 125000.00 }
          }
        },
        metadata: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            interval: { type: 'string', enum: ['weekly', 'monthly'] },
            totalPeriods: { type: 'number', example: 5 }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid date format or date range',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getCarSalesStatistics(@Body() dashboardSalesDto: DashboardSalesDto): Promise<DashboardSalesResponse> {
    const startDate = new Date(dashboardSalesDto.startDate);
    const endDate = new Date(dashboardSalesDto.endDate);
    
    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format provided');
    }
    
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    
    return this.dashboardService.getCarSalesStatistics(startDate, endDate);
  }

  @Post('car-sales-by-model')
  @ApiOperation({ 
    summary: 'Get car sales statistics grouped by model within a date range',
    description: 'Returns car sales data grouped by auto model, formatted for diagram charts (bar charts, pie charts) to compare sales between different models.'
  })
  @ApiResponse({
    status: 200,
    description: 'Car sales by model statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              modelId: { type: 'number', example: 1 },
              modelName: { type: 'string', example: 'Camry' },
              brandName: { type: 'string', example: 'Toyota' },
              count: { type: 'number', example: 15 },
              revenue: { type: 'number', example: 375000.00 },
              percentage: { type: 'number', example: 30.5 }
            }
          }
        },
        summary: {
          type: 'object',
          properties: {
            totalSales: { type: 'number', example: 50 },
            totalRevenue: { type: 'number', example: 1250000.00 },
            totalModels: { type: 'number', example: 8 },
            averageSalesPerModel: { type: 'number', example: 6.25 },
            averageRevenuePerModel: { type: 'number', example: 156250.00 }
          }
        },
        metadata: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            totalModels: { type: 'number', example: 8 }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid date format or date range',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getCarSalesByModel(@Body() dashboardSalesDto: DashboardSalesDto): Promise<DashboardModelSalesResponse> {
    const startDate = new Date(dashboardSalesDto.startDate);
    const endDate = new Date(dashboardSalesDto.endDate);
    
    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format provided');
    }
    
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    
    return this.dashboardService.getCarSalesByModel(startDate, endDate);
  }

  @Post('comprehensive-statistics')
  @ApiOperation({ 
    summary: 'Get comprehensive business statistics within a date range',
    description: 'Returns complete business overview including stock metrics, customer metrics, and sales metrics for the specified period.'
  })
  @ApiResponse({
    status: 200,
    description: 'Comprehensive statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        stockMetrics: {
          type: 'object',
          properties: {
            totalCarsAvailable: { type: 'number', example: 150 },
            totalCarsReserved: { type: 'number', example: 25 },
            totalCarsSold: { type: 'number', example: 75 },
            totalCarsInStock: { type: 'number', example: 250 }
          }
        },
        customerMetrics: {
          type: 'object',
          properties: {
            totalCustomers: { type: 'number', example: 500 },
            newCustomersInPeriod: { type: 'number', example: 45 }
          }
        },
        salesMetrics: {
          type: 'object',
          properties: {
            totalCarsSold: { type: 'number', example: 75 },
            totalSalesAmount: { type: 'number', example: 1875000.00 },
            totalInitialPayments: { type: 'number', example: 468750.00 },
            totalOutstandingAmount: { type: 'number', example: 1406250.00 },
            averagePaymentPercentage: { type: 'number', example: 25.0 }
          }
        },
        metadata: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            generatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid date format or date range',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getComprehensiveStatistics(@Body() dashboardSalesDto: DashboardSalesDto): Promise<ComprehensiveStatistics> {
    const startDate = new Date(dashboardSalesDto.startDate);
    const endDate = new Date(dashboardSalesDto.endDate);
    
    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format provided');
    }
    
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    
    return this.dashboardService.getComprehensiveStatistics(startDate, endDate);
  }
}
