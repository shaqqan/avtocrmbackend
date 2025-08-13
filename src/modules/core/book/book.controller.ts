import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookService } from './book.service';

@Controller('core/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('new')
  async newBooks() {
    return this.bookService.newBooks();
  }

  @Get('top-by-rating')
  async topBooksByRating() {
    return this.bookService.topBooksByRating();
  }
}
