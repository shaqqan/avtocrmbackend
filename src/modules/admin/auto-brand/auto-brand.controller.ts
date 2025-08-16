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
import { AutoBrandService } from './auto-brand.service';
import { CreateAutoBrandDto } from './dto/request/create-auto-brand.dto';
import { UpdateAutoBrandDto } from './dto/request/update-auto-brand.dto';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/databases/typeorm/entities';
import { PermissionsGuard } from 'src/common/guards';

@ApiTags('Admin - Auto Brands')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@Controller('admin/auto-brands')
export class AutoBrandController {
  constructor(private readonly autoBrandService: AutoBrandService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new auto brand' })
  @ApiResponse({
    status: 201,
    description: 'Auto brand created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Brand name already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createAutoBrandDto: CreateAutoBrandDto,
    @GetUser() user: User,
  ) {
    return this.autoBrandService.create(createAutoBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all auto brands with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Auto brands retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Query() query: BasePaginationDto) {
    return this.autoBrandService.findAll(query);
  }

  @Get('with-model-count')
  @ApiOperation({ summary: 'Get all auto brands with model count' })
  @ApiResponse({
    status: 200,
    description: 'Auto brands with model count retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findBrandsWithModelCount() {
    return this.autoBrandService.findBrandsWithModelCount();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get auto brand by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto brand retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto brand not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string) {
    return this.autoBrandService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update auto brand by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto brand updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Brand name already exists',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto brand not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updateAutoBrandDto: UpdateAutoBrandDto,
    @GetUser() user: User,
  ) {
    return this.autoBrandService.update(+id, updateAutoBrandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete auto brand by ID' })
  @ApiResponse({
    status: 200,
    description: 'Auto brand deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot delete brand with models',
  })
  @ApiResponse({
    status: 404,
    description: 'Auto brand not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.autoBrandService.remove(+id);
  }
}
