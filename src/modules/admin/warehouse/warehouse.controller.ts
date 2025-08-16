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
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/request/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/request/update-warehouse.dto';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/databases/typeorm/entities';
import { PermissionsGuard } from 'src/common/guards';

@ApiTags('Admin - Warehouses')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@Controller('admin/warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Warehouse name already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createWarehouseDto: CreateWarehouseDto,
    @GetUser() user: User,
  ) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Query() query: BasePaginationDto) {
    return this.warehouseService.findAll(query);
  }

  @Get('ordered-by-name')
  @ApiOperation({ summary: 'Get all warehouses ordered by name' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses ordered by name retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAllOrderedByName() {
    return this.warehouseService.findAllOrderedByName();
  }

  @Get('with-location')
  @ApiOperation({ summary: 'Get all warehouses with location coordinates' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses with location retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findWarehousesWithLocation() {
    return this.warehouseService.findWarehousesWithLocation();
  }

  @Get('search/name/:pattern')
  @ApiOperation({ summary: 'Search warehouses by name pattern' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses by name pattern retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findWarehousesByNamePattern(@Param('pattern') pattern: string) {
    return this.warehouseService.findWarehousesByNamePattern(pattern);
  }

  @Get('search/address/:pattern')
  @ApiOperation({ summary: 'Search warehouses by address pattern' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses by address pattern retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findWarehousesByAddressPattern(@Param('pattern') pattern: string) {
    return this.warehouseService.findWarehousesByAddressPattern(pattern);
  }

  @Get('search/advanced')
  @ApiOperation({ summary: 'Advanced search warehouses by multiple criteria' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses by advanced search retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  searchWarehouses(
    @Query('name') name?: string,
    @Query('address') address?: string,
    @Query('hasLocation') hasLocation?: string,
  ) {
    const criteria: any = {};
    if (name) criteria.name = name;
    if (address) criteria.address = address;
    if (hasLocation !== undefined) {
      criteria.hasLocation = hasLocation === 'true';
    }
    return this.warehouseService.searchWarehouses(criteria);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of warehouses' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses count retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getWarehousesCount() {
    return this.warehouseService.getWarehousesCount();
  }

  @Get('count/with-location')
  @ApiOperation({ summary: 'Get count of warehouses with location coordinates' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses with location count retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getWarehousesWithLocationCount() {
    return this.warehouseService.getWarehousesWithLocationCount();
  }

  @Get('exists/:name')
  @ApiOperation({ summary: 'Check if warehouse exists by name' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse existence check completed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async warehouseExists(@Param('name') name: string) {
    const exists = await this.warehouseService.warehouseExists(name);
    return { exists, name };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update warehouse by ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Warehouse name already exists',
  })
  @ApiResponse({
    status: 404,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
    @GetUser() user: User,
  ) {
    return this.warehouseService.update(+id, updateWarehouseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete warehouse by ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.warehouseService.remove(+id);
  }
}
