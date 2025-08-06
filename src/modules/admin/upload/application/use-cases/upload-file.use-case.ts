import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { FastifyRequest } from 'fastify';
import { Readable } from 'stream';

import { File } from 'src/databases/typeorm/entities';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { UploadRequestVO } from '../../domain/value-objects/upload-request.vo';
import { UploadResultVO } from '../../domain/value-objects/upload-result.vo';
import { IStorageService } from '../../domain/interfaces/storage.interface';
import { IFileValidationService } from '../../domain/interfaces/validation.interface';
import { StorageService } from '../../infrastructure/services/storage.service';
import { FileValidationService } from '../../infrastructure/services/validation.service';
import { UploadMapper } from '../../mapper/upload.mapper';
import { UploadResponseDto } from '../../dto/response/upload.res.dto';

export interface IUploadFileRequest {
  category: string;
  format: string;
  titleUz?: string;
  titleRu?: string;
  titleEn?: string;
  chapter?: number;
  duration?: number;
  lang?: string;
  isActive?: boolean;
}

@Injectable()
export class UploadFileUseCase {
  private readonly logger = new Logger(UploadFileUseCase.name);

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
    private readonly validationService: FileValidationService,
    private readonly i18n: I18nService,
  ) {}

  async execute(
    req: FastifyRequest,
    uploadRequest: IUploadFileRequest,
  ): Promise<MessageWithDataResponseDto<UploadResponseDto>> {
    const startTime = Date.now();
    let queryRunner: QueryRunner | null = null;
    let storedFilePath: string | null = null;

    try {
      // Extract file from Fastify multipart request
      const body = req.body as any;
      const fileData = body.file;

      if (!fileData) {
        throw new BadRequestException(
          this.i18n.t('errors.VALIDATION.FILE_REQUIRED'),
        );
      }

      // Create upload request value object
      const uploadRequestVO = new UploadRequestVO(
        uploadRequest.category as any,
        uploadRequest.format as any,
        fileData.filename,
        fileData.mimetype,
        fileData._buf?.length || 0,
        fileData.encoding,
        uploadRequest.titleUz,
        uploadRequest.titleRu,
        uploadRequest.titleEn,
        uploadRequest.chapter || 0,
        uploadRequest.duration || 0,
        uploadRequest.lang || 'uzb',
      );

      this.logger.log(
        `Starting upload for file: ${uploadRequestVO.filename} (${uploadRequestVO.category})`,
      );

      // Get file stream from Fastify multipart
      const fileStream = await this.getFileStreamFromMultipart(fileData);
      const fileBuffer = await fileData.toBuffer();

      // Validate file
      await this.validationService.validateFile(
        uploadRequestVO.mimetype,
        fileBuffer.length,
        uploadRequestVO.filename,
        uploadRequestVO.category,
        uploadRequestVO.format,
      );

      // Create database transaction
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Store file using stream for performance
      const storageResult = await this.storageService.storeFile(
        fileStream,
        {
          filename: uploadRequestVO.filename,
          mimetype: uploadRequestVO.mimetype,
          size: fileBuffer.length,
          encoding: uploadRequestVO.encoding || 'binary',
        },
        uploadRequestVO.getStoragePath(),
      );

      storedFilePath = storageResult.path;

      // Create database record
      const fileEntity = queryRunner.manager.create(
        File,
        UploadMapper.fromUploadRequestToEntity(
          uploadRequestVO,
          storageResult.path,
          storageResult.size,
        ),
      );

      const savedEntity = await queryRunner.manager.save(File, fileEntity);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Create result VO
      const uploadResult = new UploadResultVO(
        savedEntity.id,
        savedEntity.name,
        uploadRequestVO.filename,
        savedEntity.category,
        savedEntity.format,
        savedEntity.size,
        uploadRequestVO.mimetype,
        storageResult.path,
        savedEntity.title_uz,
        savedEntity.title_ru,
        savedEntity.title_en,
        savedEntity.chapter,
        savedEntity.duration,
        savedEntity.lang,
        savedEntity.isActive,
        savedEntity.createdAt,
        storageResult.checksum,
      );

      const responseDto = UploadMapper.fromUploadResultToDto(uploadResult);

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `File upload completed successfully: ${savedEntity.id} (${processingTime}ms)`,
      );

      return new MessageWithDataResponseDto(
        this.i18n.t('success.UPLOAD.UPLOADED'),
        responseDto,
      );
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`, error.stack);

      // Rollback transaction
      if (queryRunner) {
        try {
          await queryRunner.rollbackTransaction();
        } catch (rollbackError) {
          this.logger.error(
            `Transaction rollback failed: ${rollbackError.message}`,
            rollbackError.stack,
          );
        }
      }

      // Cleanup stored file on error
      if (storedFilePath) {
        try {
          await this.storageService.deleteFile(storedFilePath);
          this.logger.log(`Cleaned up file after error: ${storedFilePath}`);
        } catch (cleanupError) {
          this.logger.error(
            `File cleanup failed: ${cleanupError.message}`,
            cleanupError.stack,
          );
        }
      }

      // Re-throw with proper error handling
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.FILE_UPLOAD_FAILED', {
          args: { reason: error.message },
        }),
      );
    } finally {
      // Release query runner
      if (queryRunner) {
        try {
          await queryRunner.release();
        } catch (releaseError) {
          this.logger.error(
            `Query runner release failed: ${releaseError.message}`,
            releaseError.stack,
          );
        }
      }
    }
  }

  private async getFileStreamFromMultipart(fileData: any): Promise<Readable> {
    // Create a readable stream from the buffer
    const readable = new Readable({
      read() {},
    });

    const buffer = await fileData.toBuffer();
    readable.push(buffer);
    readable.push(null); // End of stream

    return readable;
  }

  /**
   * Validate upload request parameters
   */
  private validateUploadRequest(request: IUploadFileRequest): void {
    if (!request.category) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.CATEGORY_REQUIRED'),
      );
    }

    if (!request.format) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.FORMAT_REQUIRED'),
      );
    }

    if (request.chapter !== undefined && request.chapter < 0) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.INVALID_CHAPTER'),
      );
    }

    if (request.duration !== undefined && request.duration < 0) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.INVALID_DURATION'),
      );
    }

    if (request.lang && request.lang.length !== 3) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.INVALID_LANGUAGE_CODE'),
      );
    }
  }

  /**
   * Get processing statistics
   */
  async getProcessingStats(): Promise<{
    totalProcessed: number;
    averageProcessingTime: number;
    successRate: number;
  }> {
    // This would be implemented with proper metrics collection
    // For now, return dummy data
    return {
      totalProcessed: 0,
      averageProcessingTime: 0,
      successRate: 100,
    };
  }
}
