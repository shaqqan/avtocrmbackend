import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, Author, Genre, Issuer, File, BookAudiobookLink } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author, Genre, Issuer, File, BookAudiobookLink])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule { }
