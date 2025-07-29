import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/request/create-genre.dto';
import { UpdateGenreDto } from './dto/request/update-genre.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { BasePaginationDto } from 'src/common/dto/request';

@Controller('admin/genres')
// @UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('🎬 Genres')
// @ApiBearerAuth()
@ApiGlobalResponses()
export class GenresController {
  constructor(private readonly genresService: GenresService) { }

  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  findAll(@Query() query: BasePaginationDto) {
    return this.genresService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genresService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genresService.remove(+id);
  }

  @Get('list')
  list() {
    return this.genresService.list();
  }
}
