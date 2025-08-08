import { Module } from '@nestjs/common';
import { StatisticsModule } from './statistics/statistics.module';
import { BookModule } from './book/book.module';
import { AudioBookModule } from './audio-book/audio-book.module';
import { NewsModule } from './news/news.module';
import { SearchModule } from './search/search.module';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [StatisticsModule, BookModule, AudioBookModule, NewsModule, SearchModule, GenreModule],
})
export class CoreModule {}
