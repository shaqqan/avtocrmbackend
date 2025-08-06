import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('core/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Get('new')
  newBooks() {
    return this.bookService.newBooks();
  }
}
