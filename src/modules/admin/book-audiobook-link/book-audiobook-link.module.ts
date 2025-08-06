import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookAudiobookLinkService } from './book-audiobook-link.service';
import { BookAudiobookLinkController } from './book-audiobook-link.controller';
import { BookAudiobookLink } from '../../../databases/typeorm/entities/book-audiobook-link.entity';
import { Book } from '../../../databases/typeorm/entities/book.entity';
import { AudioBook } from '../../../databases/typeorm/entities/audio-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookAudiobookLink, Book, AudioBook])],
  controllers: [BookAudiobookLinkController],
  providers: [BookAudiobookLinkService],
  exports: [BookAudiobookLinkService],
})
export class BookAudiobookLinkModule {}
