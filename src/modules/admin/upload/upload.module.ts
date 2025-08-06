import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { File } from 'src/databases/typeorm/entities/file.entity';

// Controllers
import { UploadController } from './upload.controller';

// Services
import { UploadService } from './upload.service';

// Application Layer
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';

// Infrastructure Layer
import { StorageService } from './infrastructure/services/storage.service';
import { FileValidationService } from './infrastructure/services/validation.service';

// Domain Layer Interfaces
import { IStorageService } from './domain/interfaces/storage.interface';
import { IFileValidationService } from './domain/interfaces/validation.interface';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [UploadController],
  providers: [
    // Main Service
    UploadService,

    // Use Cases
    UploadFileUseCase,

    // Infrastructure Services
    StorageService,
    FileValidationService,
  ],
  exports: [UploadService, StorageService, FileValidationService],
})
export class UploadModule {}
