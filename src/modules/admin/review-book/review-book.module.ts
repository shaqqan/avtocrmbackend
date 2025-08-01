import { Module } from '@nestjs/common';
import { ReviewBookService } from './review-book.service';
import { ReviewBookController } from './review-book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewBook, Book, User } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewBook, Book, User])],
  controllers: [ReviewBookController],
  providers: [ReviewBookService],
})
export class ReviewBookModule { }
