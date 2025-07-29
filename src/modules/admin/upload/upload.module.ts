import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/databases/typeorm/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule { }
