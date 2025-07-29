import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/request/create-author.dto';
import { UpdateAuthorDto } from './dto/request/update-author.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';

@Controller('admin/author')
// @UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('👨 Authors')
// @ApiBearerAuth()
@ApiGlobalResponses()
export class AuthorController {
  constructor(private readonly authorService: AuthorService) { }

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  findAll(@Query() query: BasePaginationDto) {
    return this.authorService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(+id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(+id);
  }

  @Get('list')
  list() {
    return this.authorService.list();
  }
}
