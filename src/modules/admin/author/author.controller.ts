import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/request/create-author.dto';
import { UpdateAuthorDto } from './dto/request/update-author.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';

@Controller('admin/author')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('👨 Authors')
@ApiBearerAuth()
@ApiGlobalResponses()
export class AuthorController {
  constructor(private readonly authorService: AuthorService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors with pagination' })
  findAll(@Query() query: BasePaginationDto) {
    return this.authorService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an author by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an author by ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an author by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.remove(id);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all authors list' })
  list() {
    return this.authorService.list();
  }
}
