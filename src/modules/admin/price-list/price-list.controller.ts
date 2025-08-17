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
import { PriceListService } from './price-list.service';
import { CreatePriceListDto } from './dto/request/create-price-list.dto';
import { UpdatePriceListDto } from './dto/request/update-price-list.dto';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/databases/typeorm/entities';
import { PermissionsGuard } from 'src/common/guards';

@ApiTags('Admin - Price Lists')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@Controller('admin/price-lists')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new price list' })
  @ApiResponse({
    status: 201,
    description: 'Price list created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Related entities not found or price list already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createPriceListDto: CreatePriceListDto,
    @GetUser() user: User,
  ) {
    return this.priceListService.create(createPriceListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all price lists with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'Price lists retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Paginate() query: PaginateQuery) {
    return this.priceListService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get price list by ID' })
  @ApiResponse({
    status: 200,
    description: 'Price list retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Price list not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string) {
    return this.priceListService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update price list by ID' })
  @ApiResponse({
    status: 200,
    description: 'Price list updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Related entities not found or price list already exists',
  })
  @ApiResponse({
    status: 404,
    description: 'Price list not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updatePriceListDto: UpdatePriceListDto,
    @GetUser() user: User,
  ) {
    return this.priceListService.update(+id, updatePriceListDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete price list by ID' })
  @ApiResponse({
    status: 200,
    description: 'Price list deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Price list not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.priceListService.remove(+id);
  }
}
