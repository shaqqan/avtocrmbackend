import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/request/create-stock.dto';
import { UpdateStockDto } from './dto/request/update-stock.dto';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/databases/typeorm/entities';
import { PermissionsGuard } from 'src/common/guards';
import { StockStatus } from 'src/databases/typeorm/entities';

@ApiTags('Admin - Stocks')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@Controller('admin/stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new stock item' })
  @ApiResponse({
    status: 201,
    description: 'Stock item created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Related entity not found or body number already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createStockDto: CreateStockDto,
    @GetUser() user: User,
  ) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock items with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Stock items retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Query() query: BasePaginationDto) {
    return this.stockService.findAll(query);
  }

  @Get('by-warehouse/:warehouseId')
  @ApiOperation({ summary: 'Get stock items by warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock items by warehouse retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findStocksByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.stockService.findStocksByWarehouse(+warehouseId);
  }

  @Get('by-auto-model/:autoModelId')
  @ApiOperation({ summary: 'Get stock items by auto model ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock items by auto model retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findStocksByAutoModel(@Param('autoModelId') autoModelId: string) {
    return this.stockService.findStocksByAutoModel(+autoModelId);
  }

  @Get('by-status/:status')
  @ApiOperation({ summary: 'Get stock items by status' })
  @ApiResponse({
    status: 200,
    description: 'Stock items by status retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findStocksByStatus(@Param('status') status: StockStatus) {
    return this.stockService.findStocksByStatus(status);
  }

  @Get('search/body-number/:pattern')
  @ApiOperation({ summary: 'Search stock items by body number pattern' })
  @ApiResponse({
    status: 200,
    description: 'Stock items by body number pattern retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findStocksByBodyNumberPattern(@Param('pattern') pattern: string) {
    return this.stockService.findStocksByBodyNumberPattern(pattern);
  }

  @Get('search/advanced')
  @ApiOperation({ summary: 'Advanced search stock items by multiple criteria' })
  @ApiResponse({
    status: 200,
    description: 'Stock items by advanced search retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  searchStocks(
    @Query('warehouseId') warehouseId?: string,
    @Query('autoModelId') autoModelId?: string,
    @Query('autoColorId') autoColorId?: string,
    @Query('autoPositionId') autoPositionId?: string,
    @Query('status') status?: StockStatus,
    @Query('bodyNumber') bodyNumber?: string,
    @Query('arrivalDateAfter') arrivalDateAfter?: string,
    @Query('arrivalDateBefore') arrivalDateBefore?: string,
  ) {
    const criteria: any = {};
    if (warehouseId) criteria.warehouseId = +warehouseId;
    if (autoModelId) criteria.autoModelId = +autoModelId;
    if (autoColorId) criteria.autoColorId = +autoColorId;
    if (autoPositionId) criteria.autoPositionId = +autoPositionId;
    if (status) criteria.status = status;
    if (bodyNumber) criteria.bodyNumber = bodyNumber;
    if (arrivalDateAfter) criteria.arrivalDateAfter = new Date(arrivalDateAfter);
    if (arrivalDateBefore) criteria.arrivalDateBefore = new Date(arrivalDateBefore);
    return this.stockService.searchStocks(criteria);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get stock summary (counts by status)' })
  @ApiResponse({
    status: 200,
    description: 'Stock summary retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getStocksSummary() {
    return this.stockService.getStocksSummary();
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of stock items' })
  @ApiResponse({
    status: 200,
    description: 'Stock count retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getTotalStocksCount() {
    return this.stockService.getTotalStocksCount();
  }

  @Get('count/by-status/:status')
  @ApiOperation({ summary: 'Get count of stock items by status' })
  @ApiResponse({
    status: 200,
    description: 'Stock count by status retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getStocksCountByStatus(@Param('status') status: StockStatus) {
    return this.stockService.getStocksCountByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stock item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock item retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Stock item not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update stock item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock item updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Related entity not found or body number already exists',
  })
  @ApiResponse({
    status: 404,
    description: 'Stock item not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
    @GetUser() user: User,
  ) {
    return this.stockService.update(+id, updateStockDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete stock item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock item deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Stock item not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.stockService.remove(+id);
  }
}
