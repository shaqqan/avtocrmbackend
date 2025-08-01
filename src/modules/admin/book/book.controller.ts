import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/request/create-book.dto';
import { UpdateBookDto } from './dto/request/update-book.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { BookResponseDto, BookResponseMultiLangDto } from './dto/response/book.res.dto';
import { QueryBookDto } from './dto/request/query-book.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';

@Controller('admin/book')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('📚 Books')
@ApiBearerAuth()
@ApiGlobalResponses()
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  create(@Body() createBookDto: CreateBookDto): Promise<MessageWithDataResponseDto<BookResponseMultiLangDto>> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with pagination' })
  findAll(@Query() query: QueryBookDto) {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book by ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
