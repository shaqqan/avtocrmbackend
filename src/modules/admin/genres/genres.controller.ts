import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/request/create-genre.dto';
import { UpdateGenreDto } from './dto/request/update-genre.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { BasePaginationDto } from 'src/common/dto/request';

@Controller('admin/genres')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('🎬 Genres')
@ApiBearerAuth()
@ApiGlobalResponses()
export class GenresController {
  constructor(private readonly genresService: GenresService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({ status: 201, description: 'Genre created successfully' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres with pagination' })
  @ApiResponse({ status: 200, description: 'Genres retrieved successfully' })
  findAll(@Query() query: BasePaginationDto) {
    return this.genresService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a genre by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a genre by ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a genre by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all genres list' })
  list() {
    return this.genresService.list();
  }
}
