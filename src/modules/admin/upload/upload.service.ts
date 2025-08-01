import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { FastifyRequest } from 'fastify';

import { File } from 'src/databases/typeorm/entities';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { FileCategory, FileFormat } from 'src/common/enums';

// Application Layer
import { UploadFileUseCase, IUploadFileRequest } from './application/use-cases/upload-file.use-case';

// Infrastructure Layer
import { StorageService } from './infrastructure/services/storage.service';
import { FileValidationService } from './infrastructure/services/validation.service';

// DTOs and Mappers
import { UploadResponseDto, UploadStatsDto, BatchUploadResponseDto } from './dto/response/upload.res.dto';
import { UploadMapper } from './mapper/upload.mapper';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly dataSource: DataSource,
    private readonly i18n: I18nService,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly storageService: StorageService,
    private readonly validationService: FileValidationService
  ) {}

  /**
   * Upload a single file with high performance and proper error handling
   */
  async uploadFile(
    req: FastifyRequest,
    uploadData: { 
      category: FileCategory; 
      format: FileFormat;
      titleUz?: string;
      titleRu?: string;
      titleEn?: string;
      chapter?: number;
      duration?: number;
      lang?: string;
      isActive?: boolean;
    }
  ): Promise<MessageWithDataResponseDto<UploadResponseDto>> {
    this.logger.log(`Upload request received: ${uploadData.category}/${uploadData.format}`);

    const uploadRequest: IUploadFileRequest = {
      category: uploadData.category,
      format: uploadData.format,
      titleUz: uploadData.titleUz,
      titleRu: uploadData.titleRu,
      titleEn: uploadData.titleEn,
      chapter: uploadData.chapter,
      duration: uploadData.duration,
      lang: uploadData.lang,
      isActive: uploadData.isActive ?? true
    };

    return await this.uploadFileUseCase.execute(req, uploadRequest);
  }

  /**
   * Upload multiple files in batch with optimal performance
   */
  async uploadBatch(
    req: FastifyRequest,
    options: {
      category: FileCategory;
      format: FileFormat;
      maxFiles?: number;
    }
  ): Promise<MessageWithDataResponseDto<BatchUploadResponseDto>> {
    const startTime = Date.now();
    const maxFiles = options.maxFiles || 10;
    
    this.logger.log(`Batch upload started: max ${maxFiles} files`);

    const body = req.body as any;
    const files = Array.isArray(body.files) ? body.files : [body.files].filter(Boolean);

    if (!files || files.length === 0) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.NO_FILES_PROVIDED'));
    }

    if (files.length > maxFiles) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.TOO_MANY_FILES', {
          args: { max: maxFiles, received: files.length }
        })
      );
    }

    const results: UploadResponseDto[] = [];
    const errors: Array<{ filename: string; error: string }> = [];
    let totalSize = 0;

    // Process files concurrently with controlled concurrency
    const concurrencyLimit = 3;
    const chunks = this.chunkArray(files, concurrencyLimit);

    for (const chunk of chunks) {
      const promises = chunk.map(async (fileData: any) => {
        try {
          const mockRequest = {
            body: { file: fileData }
          } as any;

          const result = await this.uploadFileUseCase.execute(mockRequest, {
            category: options.category,
            format: options.format
          });

          totalSize += result.data.size;
          return result.data;
        } catch (error) {
          this.logger.error(`Batch upload file failed: ${fileData?.filename || 'unknown'}`, error.stack);
          errors.push({
            filename: fileData?.filename || 'unknown',
            error: error.message || 'Unknown error'
          });
          return null;
        }
      });

      const chunkResults = await Promise.all(promises);
      results.push(...chunkResults.filter((result): result is UploadResponseDto => result !== null));
    }

    const processingTime = Date.now() - startTime;
    const response = new BatchUploadResponseDto({
      successful: results,
      failed: errors,
      totalProcessed: files.length,
      successCount: results.length,
      failureCount: errors.length,
      totalSize,
      processingTime
    });

    this.logger.log(`Batch upload completed: ${results.length}/${files.length} successful (${processingTime}ms)`);

    return new MessageWithDataResponseDto(
      this.i18n.t('success.UPLOAD.BATCH_COMPLETED', {
        args: { successful: results.length, total: files.length }
      }),
      response
    );
  }

  /**
   * Get comprehensive upload statistics
   */
  async getUploadStats(
    category?: FileCategory,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<MessageWithDataResponseDto<UploadStatsDto>> {
    this.logger.log(`Getting upload stats: category=${category}, dateFrom=${dateFrom}, dateTo=${dateTo}`);

    const queryBuilder = this.fileRepository.createQueryBuilder('file');

    if (category) {
      queryBuilder.andWhere('file.category = :category', { category });
    }

    if (dateFrom) {
      queryBuilder.andWhere('file.createdAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('file.createdAt <= :dateTo', { dateTo });
    }

    const [files, totalFiles] = await queryBuilder.getManyAndCount();
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    // Get storage statistics
    const storageStats = await this.storageService.getStorageStats();

    // Aggregate by category
    const filesByCategory = files.reduce((acc, file) => {
      acc[file.category] = (acc[file.category] || 0) + 1;
      return acc;
    }, {} as Record<FileCategory, number>);

    // Aggregate by format
    const filesByFormat = files.reduce((acc, file) => {
      acc[file.format] = (acc[file.format] || 0) + 1;
      return acc;
    }, {} as Record<FileFormat, number>);

    const averageFileSize = totalFiles > 0 ? Math.round(totalSize / totalFiles) : 0;
    const latestUpload = files.length > 0 
      ? files.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
      : undefined;

    const statsDto = new UploadStatsDto({
      totalFiles,
      totalSize,
      totalSizeFormatted: UploadMapper.formatFileSize(totalSize),
      availableSpace: storageStats.availableSpace,
      availableSpaceFormatted: UploadMapper.formatFileSize(storageStats.availableSpace),
      filesByCategory,
      filesByFormat,
      averageFileSize,
      latestUpload
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.UPLOAD.STATS_RETRIEVED'),
      statsDto
    );
  }

  /**
   * Delete a file and clean up storage
   */
  async deleteFile(fileId: number): Promise<MessageWithDataResponseDto<{ success: boolean }>> {
    this.logger.log(`Deleting file: ${fileId}`);

    const file = await this.fileRepository.findOne({ where: { id: fileId } });
    if (!file) {
      throw new NotFoundException(this.i18n.t('errors.VALIDATION.FILE_NOT_FOUND'));
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete from database first
      await queryRunner.manager.delete(File, { id: fileId });

      // Then delete from storage
      await this.storageService.deleteFile(file.name);

      await queryRunner.commitTransaction();

      this.logger.log(`File deleted successfully: ${fileId}`);

      return new MessageWithDataResponseDto(
        this.i18n.t('success.UPLOAD.FILE_DELETED'),
        { success: true }
      );

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`File deletion failed: ${error.message}`, error.stack);
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.FILE_DELETE_FAILED', {
          args: { reason: error.message }
        })
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Clean up expired files (if expiration logic is implemented)
   */
  async cleanupExpiredFiles(): Promise<{ deletedCount: number; freedSpace: number }> {
    this.logger.log('Starting expired files cleanup');

    // For now, this is a placeholder since the File entity doesn't have expiration
    // In a real implementation, you would:
    // 1. Find expired files based on some criteria
    // 2. Delete them from storage and database
    // 3. Return statistics

    return {
      deletedCount: 0,
      freedSpace: 0
    };
  }

  /**
   * Health check for upload service
   */
  async healthCheck(): Promise<{
    status: string;
    storage: {
      accessible: boolean;
      stats: any;
    };
    database: {
      accessible: boolean;
      connectionCount: number;
    };
  }> {
    try {
      // Check storage
      const storageStats = await this.storageService.getStorageStats();
      
      // Check database
      const fileCount = await this.fileRepository.count();
      
      return {
        status: 'healthy',
        storage: {
          accessible: true,
          stats: storageStats
        },
        database: {
          accessible: true,
          connectionCount: fileCount
        }
      };
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`, error.stack);
      
      return {
        status: 'unhealthy',
        storage: {
          accessible: false,
          stats: null
        },
        database: {
          accessible: false,
          connectionCount: 0
        }
      };
    }
  }

  /**
   * Utility method to chunk array for batch processing
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
