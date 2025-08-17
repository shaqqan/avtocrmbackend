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
import { AutoColorService } from './auto-color.service';
import { CreateAutoColorDto } from './dto/request/create-auto-color.dto';
import { UpdateAutoColorDto } from './dto/request/update-auto-color.dto';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/databases/typeorm/entities';
import { PermissionsGuard } from 'src/common/guards';

@ApiTags('Admin - Auto Colors')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@Controller('admin/auto-colors')
export class AutoColorController {
  constructor(private readonly autoColorService: AutoColorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new auto color' })
  @ApiResponse({
    status: 201,
    description: 'Auto color created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Color name already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createAutoColorDto: CreateAutoColorDto,
    @GetUser() user: User,
  ) {
    return this.autoColorService.create(createAutoColorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all auto colors with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Auto colors retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Paginate() query: PaginateQuery) {
    return this.autoColorService.findAll(query);
  }

  @Get('ordered-by-name')
  @ApiOperation({ summary: 'Get all auto colors ordered by name' })
  @ApiResponse({
    status: 200,
    description: 'Auto colors ordered by name retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAllOrderedByName() {
    return this.autoColorService.findAllOrderedByName();
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular auto colors' })
  @ApiResponse({
    status: 200,
    description: 'Popular auto colors retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getPopularColors(@Query('limit') limit: string) {
    return this.autoColorService.getPopularColors(limit ? +limit : 10);
  }

  @Get('search/name/:pattern')
  @ApiOperation({ summary: 'Search auto colors by name pattern' })
  @ApiResponse({
    status: 200,
    description: 'Auto colors by name pattern retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findColorsByNamePattern(@Param('pattern') pattern: string) {
    return this.autoColorService.findColorsByNamePattern(pattern);
  }

  @Get('search/advanced')
  @ApiOperation({ summary: 'Advanced search auto colors by multiple criteria' })
  @ApiResponse({
    status: 200,
    description: 'Auto colors by advanced search retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  searchColors(
    @Query('name') name?: string,
    @Query('createdAfter') createdAfter?: string, 
    @Query('createdBefore') createdBefore?: string,
  ) {
    const criteria: any = {};
    if (name) criteria.name = name;
    if (createdAfter) criteria.createdAfter = new Date(createdAfter);
    if (createdBefore) criteria.createdBefore = new Date(createdBefore);
    return this.autoColorService.searchColors(criteria);
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get auto colors with custom filters' })
  @ApiResponse({
    status: 200,
    description: 'Auto colors with filters retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findColorsWithFilters(
    @Query('name') name?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters: any = {};
    if (name) filters.name = name;
    if (page) filters.page = +page;
    if (limit) filters.limit = +limit;
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;
    return this.autoColorService.findColorsWithFilters(filters);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of auto colors' })
  @ApiResponse({
    status: 200,
    description: 'Auto colors count retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getColorsCount() {
    return this.autoColorService.getColorsCount();
  }

  @Get('exists/:name')
  @ApiOperation({ summary: 'Check if auto color exists by name' })
  @ApiResponse({
    status: 200,
    description: 'Auto color existence check completed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async colorExists(@Param('name') name: string) {
    const exists = await this.autoColorService.colorExists(name);
    return { exists, name };
  }

  @Get('by-model/:autoModelId')
  @ApiOperation({ summary: 'Get auto colors by auto model ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto colors retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findColorsByAutoModel(@Param('autoModelId') autoModelId: string) {
    return this.autoColorService.findColorsByAutoModel(+autoModelId);
  }

  @Get('with-model-info')
  @ApiOperation({ summary: 'Get all auto colors with auto model information' })
  @ApiResponse({
    status: 200,
    description: 'Auto colors with model info retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findColorsWithAutoModelInfo() {
    return this.autoColorService.findColorsWithAutoModelInfo();
  }

  @Get('exists/:name/model/:autoModelId')
  @ApiOperation({ summary: 'Check if auto color exists for specific auto model' })
  @ApiResponse({
    status: 200,
    description: 'Auto color existence check completed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async colorExistsForModel(
    @Param('name') name: string,
    @Param('autoModelId') autoModelId: string,
  ) {
    const exists = await this.autoColorService.colorExistsForModel(name, +autoModelId);
    return { exists, name, autoModelId: +autoModelId };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get auto color by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto color retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto color not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string) {
    return this.autoColorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update auto color by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto color updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Color name already exists',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto color not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updateAutoColorDto: UpdateAutoColorDto,
    @GetUser() user: User,
  ) {
    return this.autoColorService.update(+id, updateAutoColorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete auto color by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto color deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto color not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.autoColorService.remove(+id);
  }
}
