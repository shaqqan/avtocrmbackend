import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenreService } from './genre.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { TopGenreResponseDto } from './dto/top-genre-response.dto';

@ApiTags('Genres')
@Controller('core/genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) { }

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  async findAll() {
    return this.genreService.findAll();
  }

  @Get('top')
  @ApiOperation({ 
    summary: 'Get top 30 genres by content count',
    description: 'Returns the top 30 genres sorted by total number of books and audiobooks'
  })
  @ApiResponse({
    status: 200,
    description: 'Top 30 genres with book and audiobook counts',
    type: [TopGenreResponseDto],
  })
  async getTopGenres(): Promise<TopGenreResponseDto[]> {
    return this.genreService.getTopGenres();
  }
}
