import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/request/create-genre.dto';
import { UpdateGenreDto } from './dto/request/update-genre.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { BasePaginationDto } from 'src/common/dto/request';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/common/enums';
import { PermissionsGuard } from 'src/common/guards';

@Controller('admin/genres')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiTags('🎬 Genres')
@ApiBearerAuth()
@ApiGlobalResponses()
export class GenresController {
  constructor(private readonly genresService: GenresService) { }

  @Post()
  @RequirePermissions(PermissionsEnum.CREATE_GENRE)
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({ status: 201, description: 'Genre created successfully' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @RequirePermissions(PermissionsEnum.READ_GENRE)
  @ApiOperation({ summary: 'Get all genres with pagination' })
  @ApiResponse({ status: 200, description: 'Genres retrieved successfully' })
  findAll(@Query() query: BasePaginationDto) {
    return this.genresService.findAll(query);
  }

  @Get('list')
  @RequirePermissions(PermissionsEnum.READ_GENRE)
  @ApiOperation({ summary: 'Get all genres list' })
  list() {
    return this.genresService.list();
  }

  @Get(':id')
  @RequirePermissions(PermissionsEnum.READ_GENRE)
  @ApiOperation({ summary: 'Get a genre by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsEnum.UPDATE_GENRE)
  @ApiOperation({ summary: 'Update a genre by ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionsEnum.DELETE_GENRE)
  @ApiOperation({ summary: 'Delete a genre by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }
}
