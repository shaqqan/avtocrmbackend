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
import { AutoModelService } from './auto-model.service';
import { CreateAutoModelDto } from './dto/request/create-auto-model.dto';
import { UpdateAutoModelDto } from './dto/request/update-auto-model.dto';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/databases/typeorm/entities';
import { PermissionsGuard } from 'src/common/guards';

@ApiTags('Admin - Auto Models')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@Controller('admin/auto-models')
export class AutoModelController {
  constructor(private readonly autoModelService: AutoModelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new auto model' })
  @ApiResponse({
    status: 201,
    description: 'Auto model created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Brand not found or model name already exists for brand',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createAutoModelDto: CreateAutoModelDto,
    @GetUser() user: User,
  ) {
    return this.autoModelService.create(createAutoModelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all auto models with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Auto models retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Query() query: BasePaginationDto) {
    return this.autoModelService.findAll(query);
  }

  @Get('by-brand/:brandId')
  @ApiOperation({ summary: 'Get auto models by brand ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto models by brand retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findModelsByBrand(@Param('brandId') brandId: string) {
    return this.autoModelService.findModelsByBrand(+brandId);
  }

  @Get('with-brand-info')
  @ApiOperation({ summary: 'Get all auto models with brand information' })
  @ApiResponse({
    status: 200,
    description: 'Auto models with brand info retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findModelsWithBrandInfo() {
    return this.autoModelService.findModelsWithBrandInfo();
  }

  @Get('search-by-brand/:brandName')
  @ApiOperation({ summary: 'Search auto models by brand name' })
  @ApiResponse({
    status: 200,
    description: 'Auto models by brand name retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  searchModelsByBrandName(@Param('brandName') brandName: string) {
    return this.autoModelService.searchModelsByBrandName(brandName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get auto model by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto model retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto model not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string) {
    return this.autoModelService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update auto model by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto model updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Brand not found or model name already exists for brand',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto model not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updateAutoModelDto: UpdateAutoModelDto,
    @GetUser() user: User,
  ) {
    return this.autoModelService.update(+id, updateAutoModelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete auto model by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto model deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto model not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.autoModelService.remove(+id);
  }
}
