import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/common/enums';
import { PermissionsGuard } from 'src/common/guards';

@Controller('admin/dashboard')
@ApiTags('🏗Dashboard')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiBearerAuth()
@ApiGlobalResponses()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/info-panel')
  @RequirePermissions(PermissionsEnum.READ_DASHBOARD)
  @ApiOperation({
    summary: 'Get dashboard info panel data',
    description:
      'Retrieves general statistics and information for the admin dashboard info panel',
  })
  @ApiOkResponse({
    description: 'Dashboard info panel data retrieved successfully',
  })
  async getInfoPanel() {
    return this.dashboardService.getInfoPanel();
  }

  @Get('/books-comparison-pie-chart')
  @RequirePermissions(PermissionsEnum.READ_ANALYTICS)
  @ApiOperation({
    summary: 'Get books comparison pie chart data',
    description:
      'Retrieves data for displaying books comparison in a pie chart format',
  })
  @ApiOkResponse({
    description: 'Books comparison pie chart data retrieved successfully',
  })
  async getBooksComparisonPieChart() {
    return this.dashboardService.getBooksComparisonPieChart();
  }

  @Get('/genre-comparison-line-graph')
  @RequirePermissions(PermissionsEnum.READ_ANALYTICS)
  @ApiOperation({
    summary: 'Get genre comparison line graph data',
    description:
      'Retrieves data for displaying genre comparison trends in a line graph format',
  })
  @ApiOkResponse({
    description: 'Genre comparison line graph data retrieved successfully',
  })
  async getGenreComparisonLineGraph() {
    return this.dashboardService.getGenreComparisonLineGraph();
  }

  @Get('/audiobooks-rating-stats')
  @RequirePermissions(PermissionsEnum.READ_STATISTICS)
  @ApiOperation({
    summary: 'Get audiobooks rating statistics',
    description: 'Retrieves rating statistics and analytics for audiobooks',
  })
  @ApiOkResponse({
    description: 'Audiobooks rating statistics retrieved successfully',
  })
  async getAudioBooksRatingStats() {
    return this.dashboardService.getAudioBooksRatingStats();
  }

  @Get('/ebooks-rating-stats')
  @RequirePermissions(PermissionsEnum.READ_STATISTICS)
  @ApiOperation({
    summary: 'Get e-books rating statistics',
    description: 'Retrieves rating statistics and analytics for e-books',
  })
  @ApiOkResponse({
    description: 'E-books rating statistics retrieved successfully',
  })
  async getEBooksRatingStats() {
    return this.dashboardService.getEBooksRatingStats();
  }
}
