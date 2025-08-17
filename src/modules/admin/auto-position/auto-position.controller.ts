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
import { AutoPositionService } from './auto-position.service';
import { CreateAutoPositionDto } from './dto/request/create-auto-position.dto';
import { UpdateAutoPositionDto } from './dto/request/update-auto-position.dto';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { FindAllAutoPositionDto } from './dto/request/find-all-auto-position.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/databases/typeorm/entities';
import { PermissionsGuard } from 'src/common/guards';
  
@ApiTags('Admin - Auto Positions')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@Controller('admin/auto-positions')
export class AutoPositionController {
  constructor(private readonly autoPositionService: AutoPositionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new auto position' })
  @ApiResponse({
    status: 201,
    description: 'Auto position created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Auto model not found or position name already exists for model',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createAutoPositionDto: CreateAutoPositionDto,
    @GetUser() user: User,
  ) {
    return this.autoPositionService.create(createAutoPositionDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all auto positions with pagination and optional autoModelId filter',
    description: 'Retrieve auto positions with optional filtering by autoModelId. When autoModelId is provided, only positions for that specific model will be returned.'
  })
  @ApiResponse({
    status: 200,
    description: 'Auto positions retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Paginate() query: PaginateQuery & { autoModelId?: number }) {
    return this.autoPositionService.findAll(query);
  }

  @Get('by-auto-model/:autoModelId')
  @ApiOperation({ summary: 'Get auto positions by auto model ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto positions by auto model retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findPositionsByAutoModel(@Param('autoModelId') autoModelId: string) {
    return this.autoPositionService.findPositionsByAutoModel(+autoModelId);
  }

  @Get('by-auto-model-name/:modelName')
  @ApiOperation({ summary: 'Get auto positions by auto model name' })
  @ApiResponse({
    status: 200,
    description: 'Auto positions by auto model name retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findPositionsByAutoModelName(@Param('modelName') modelName: string) {
    return this.autoPositionService.findPositionsByAutoModelName(modelName);
  }

  @Get('by-brand-name/:brandName')
  @ApiOperation({ summary: 'Get auto positions by brand name' })
  @ApiResponse({
    status: 200,
    description: 'Auto positions by brand name retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findPositionsByBrandName(@Param('brandName') brandName: string) {
    return this.autoPositionService.findPositionsByBrandName(brandName);
  }

  @Get('with-auto-model-info')
  @ApiOperation({ summary: 'Get all auto positions with auto model and brand information' })
  @ApiResponse({
    status: 200,
    description: 'Auto positions with auto model info retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findPositionsWithAutoModelInfo() {
    return this.autoPositionService.findPositionsWithAutoModelInfo();
  }

  @Get('ordered-by-name')
  @ApiOperation({ summary: 'Get all auto positions ordered by name' })
  @ApiResponse({
    status: 200,
    description: 'Auto positions ordered by name retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAllOrderedByName() {
    return this.autoPositionService.findAllOrderedByName();
  }

  @Get('search/:pattern')
  @ApiOperation({ summary: 'Search auto positions by name pattern' })
  @ApiResponse({
    status: 200,
    description: 'Auto positions by name pattern retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findPositionsByNamePattern(@Param('pattern') pattern: string) {
    return this.autoPositionService.findPositionsByNamePattern(pattern);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of auto positions' })
  @ApiResponse({
    status: 200,
    description: 'Auto positions count retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getPositionsCount() {
    return this.autoPositionService.getPositionsCount();
  }

  @Get('count/by-auto-model/:autoModelId')
  @ApiOperation({ summary: 'Get count of auto positions by auto model ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto positions count by auto model retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getPositionsCountByAutoModel(@Param('autoModelId') autoModelId: string) {
    return this.autoPositionService.getPositionsCountByAutoModel(+autoModelId);
  }

  @Get('exists/:name/:autoModelId')
  @ApiOperation({ summary: 'Check if auto position exists by name and auto model ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto position existence check completed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async positionExists(
    @Param('name') name: string,
    @Param('autoModelId') autoModelId: string,
  ) {
    const exists = await this.autoPositionService.positionExists(name, +autoModelId);
    return { exists, name, autoModelId: +autoModelId };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get auto position by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto position retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto position not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string) {
    return this.autoPositionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update auto position by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto position updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Auto model not found or position name already exists for model',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto position not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updateAutoPositionDto: UpdateAutoPositionDto,
    @GetUser() user: User,
  ) {
    return this.autoPositionService.update(+id, updateAutoPositionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete auto position by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto position deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto position not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.autoPositionService.remove(+id);
  }
}
