import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioBook, Author, Book } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Book, AudioBook, Author])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
