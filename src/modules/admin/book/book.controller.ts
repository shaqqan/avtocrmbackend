import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/request/create-book.dto';
import { UpdateBookDto } from './dto/request/update-book.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { BookResponseDto, BookResponseMultiLangDto } from './dto/response/book.res.dto';
import { QueryBookDto } from './dto/request/query-book.dto';

@Controller('admin/book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<MessageWithDataResponseDto<BookResponseMultiLangDto>> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll(@Query() query: QueryBookDto) {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
