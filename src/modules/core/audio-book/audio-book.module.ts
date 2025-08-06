import { Module } from '@nestjs/common';
import { AudioBookService } from './audio-book.service';
import { AudioBookController } from './audio-book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioBook } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([AudioBook])],
  controllers: [AudioBookController],
  providers: [AudioBookService],
})
export class AudioBookModule {}
