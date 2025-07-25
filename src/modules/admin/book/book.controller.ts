import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/request/create-book.dto';
import { UpdateBookDto } from './dto/request/update-book.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { BookResponseDto } from './dto/response/book.res.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<MessageWithDataResponseDto<BookResponseDto>> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll(@Query() query: BasePaginationDto) {
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
