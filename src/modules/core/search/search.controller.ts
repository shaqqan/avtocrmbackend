import { Controller, Get, Query, Headers, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get()
  @ApiOperation({
    summary: 'Full-text search across books, audiobooks, and authors',
    description: 'Search for books, audiobooks, and authors using case-insensitive partial matching. Returns up to 12 books, 2 audiobooks, and 50 authors sorted by relevance and popularity.',
  })
  @ApiQuery({
    name: 'q',
    description: 'Search query string',
    example: 'war and peace',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameter',
  })
  async search(
    @Query('q') query: string,
  ) {
    return this.searchService.search(query);
  }
}
