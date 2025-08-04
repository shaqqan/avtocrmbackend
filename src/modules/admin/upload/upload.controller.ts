import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Req, 
  UseGuards, 
  Query, 
  Param, 
  ParseIntPipe, 
  HttpCode, 
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Logger
} from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiBody, 
  ApiConsumes, 
  ApiOperation, 
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiUnsupportedMediaTypeResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { IsEnum, IsOptional, IsDateString, IsNumberString, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { UploadService } from './upload.service';
import { UploadFileDto } from './dto/request/upload-file.dto';
import { BatchUploadDto } from './dto/request/batch-upload.dto';
import { 
  UploadResponseDto, 
  UploadStatsDto, 
  BatchUploadResponseDto 
} from './dto/response/upload.res.dto';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { FileCategory, FileFormat } from 'src/common/enums';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/common/enums';
import { PermissionsGuard } from 'src/common/guards';

// Query DTOs for better validation and documentation
class UploadStatsQueryDto {
  @IsOptional()
  @IsEnum(FileCategory)
  category?: FileCategory;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dateFrom?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dateTo?: Date;
}

class BatchUploadQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumberString()
  @Transform(({ value }) => value ? parseInt(value) : 10)
  maxFiles?: number;
}

@Controller('admin/upload')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiTags('💾 File Upload Management')
@ApiBearerAuth()
@ApiGlobalResponses()
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @RequirePermissions(PermissionsEnum.UPLOAD_FILE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: "Upload a single file",
    description: "Uploads and processes a single file with comprehensive validation and metadata extraction. Supports multiple file types and categories with automatic format detection."
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: 'File upload with metadata',
    type: UploadFileDto,
  })
  @ApiCreatedResponse({
    description: 'File uploaded successfully',
    type: UploadResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid file, format, or request parameters'
  })
  @ApiPayloadTooLargeResponse({
    description: 'File size exceeds maximum allowed limit'
  })
  @ApiUnsupportedMediaTypeResponse({
    description: 'File type not supported for the specified category'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during file processing'
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadFile(@Req() req: FastifyRequest & { body: any }) {
    const startTime = Date.now();
    const body = req.body;
    
    // Extract and validate form data with proper fallbacks
    const uploadData = {
      category: this.extractFormValue(body.category) as FileCategory,
      format: this.extractFormValue(body.format) as FileFormat,
      titleUz: this.extractFormValue(body.titleUz),
      titleRu: this.extractFormValue(body.titleRu),
      titleEn: this.extractFormValue(body.titleEn),
      chapter: this.parseIntValue(this.extractFormValue(body.chapter)),
      duration: this.parseIntValue(this.extractFormValue(body.duration)),
      lang: this.extractFormValue(body.lang),
      isActive: this.parseBooleanValue(this.extractFormValue(body.isActive))
    };

    this.logger.log(`Upload request: ${uploadData.category}/${uploadData.format}`);

    const result = await this.uploadService.uploadFile(req, uploadData);
    
    const processingTime = Date.now() - startTime;
    this.logger.log(`Upload completed in ${processingTime}ms: ${result.data.id}`);
    
    return result;
  }

  @Post('batch')
  @RequirePermissions(PermissionsEnum.UPLOAD_FILE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: "Upload multiple files in batch",
    description: "Processes multiple files concurrently with controlled concurrency and comprehensive error handling. Returns detailed results for each file."
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: 'Batch file upload with individual metadata for each file',
    type: BatchUploadDto,
  })
  @ApiCreatedResponse({
    description: 'Batch upload completed',
    type: BatchUploadResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid files, too many files, or missing required parameters'
  })
  async uploadBatch(
    @Req() req: FastifyRequest & { body: any },
    @Query() query: BatchUploadQueryDto
  ) {
    const body = req.body;
    const uploadOptions = {
      category: this.extractFormValue(body.category) as FileCategory,
      format: this.extractFormValue(body.format) as FileFormat,
      maxFiles: query.maxFiles || 10
    };

    this.logger.log(`Batch upload request: ${uploadOptions.category}/${uploadOptions.format}, max: ${uploadOptions.maxFiles}`);

    return await this.uploadService.uploadBatch(req, uploadOptions);
  }

  @Get('stats')
  @RequirePermissions(PermissionsEnum.READ_FILE)
  @ApiOperation({ 
    summary: "Get upload statistics",
    description: "Retrieves comprehensive statistics about uploaded files including storage usage, file distributions, and performance metrics."
  })
  @ApiOkResponse({
    description: 'Upload statistics retrieved successfully',
    type: UploadStatsDto
  })
  async getUploadStats(@Query() query: UploadStatsQueryDto) {
    this.logger.log(`Stats request: category=${query.category}, dateFrom=${query.dateFrom}, dateTo=${query.dateTo}`);
    
    return await this.uploadService.getUploadStats(
      query.category,
      query.dateFrom,
      query.dateTo
    );
  }

  @Delete(':id')
  @RequirePermissions(PermissionsEnum.DELETE_FILE)
  @ApiOperation({ 
    summary: "Delete a file",
    description: "Permanently deletes a file and its metadata from both storage and database with transactional safety."
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'File ID to delete',
    example: 123
  })
  @ApiOkResponse({
    description: 'File deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'File not found'
  })
  @ApiBadRequestResponse({
    description: 'File deletion failed due to system error'
  })
  async deleteFile(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Delete request for file: ${id}`);
    return await this.uploadService.deleteFile(id);
  }

  @Post('cleanup')
  @RequirePermissions(PermissionsEnum.DELETE_FILE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: "Clean up expired files",
    description: "Removes expired files from storage and database to free up space. This is a maintenance operation."
  })
  @ApiOkResponse({
    description: 'Cleanup completed successfully',
    schema: {
      type: 'object',
      properties: {
        deletedCount: { type: 'number', example: 15 },
        freedSpace: { type: 'number', example: 157286400 }
      }
    }
  })
  async cleanupExpiredFiles() {
    this.logger.log('Cleanup request initiated');
    
    const result = await this.uploadService.cleanupExpiredFiles();
    return new MessageWithDataResponseDto(
      'Cleanup completed successfully',
      result
    );
  }

  @Get('health')
  @ApiOperation({ 
    summary: "Health check for upload service",
    description: "Checks the health status of upload service components including storage and database connectivity."
  })
  @ApiOkResponse({
    description: 'Upload service health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        storage: { 
          type: 'object',
          properties: {
            accessible: { type: 'boolean', example: true },
            stats: { type: 'object' }
          }
        },
        database: {
          type: 'object',
          properties: {
            accessible: { type: 'boolean', example: true },
            connectionCount: { type: 'number', example: 1542 }
          }
        }
      }
    }
  })
  async healthCheck() {
    const healthStatus = await this.uploadService.healthCheck();
    
    return new MessageWithDataResponseDto(
      healthStatus.status === 'healthy' 
        ? 'Upload service is healthy' 
        : 'Upload service has issues', 
      healthStatus
    );
  }

  @Get('config') 
  @ApiOperation({ 
    summary: "Get upload configuration",
    description: "Returns current upload configuration including limits, allowed file types, and supported categories."
  })
  @ApiOkResponse({
    description: 'Upload configuration retrieved successfully'
  })
  async getUploadConfig() {
    // Return sanitized configuration (without sensitive data)
    const config = {
      maxFileSize: {
        [FileCategory.EBOOK]: '50MB',
        [FileCategory.AUDIOBOOK]: '50MB',
        [FileCategory.AUDIOBOOKS]: '50MB',
        [FileCategory.COVER]: '10MB',
        [FileCategory.NEWS_IMAGE]: '10MB',
        [FileCategory.BOOKS]: '10MB',
        [FileCategory.AUTHOR_COVER]: '10MB',
        [FileCategory.GENRE_COVER]: '10MB',
        [FileCategory.LANGUAGE_ICON]: '5MB'
      },
      allowedTypes: {
        [FileCategory.EBOOK]: ['application/epub+zip', 'application/pdf', 'application/x-fictionbook+xml'],
        [FileCategory.AUDIOBOOK]: ['audio/mpeg', 'audio/mp3'],
        [FileCategory.AUDIOBOOKS]: ['audio/mpeg', 'audio/mp3'],
        [FileCategory.COVER]: ['image/jpeg', 'image/jpg', 'image/png'],
        [FileCategory.NEWS_IMAGE]: ['image/jpeg', 'image/jpg', 'image/png'],
        [FileCategory.BOOKS]: ['application/epub+zip', 'application/pdf', 'application/x-fictionbook+xml'],
        [FileCategory.AUTHOR_COVER]: ['image/jpeg', 'image/jpg', 'image/png'],
        [FileCategory.GENRE_COVER]: ['image/jpeg', 'image/jpg', 'image/png'],
        [FileCategory.LANGUAGE_ICON]: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']
      },
      maxConcurrentUploads: 3,
      maxBatchSize: 10,
      supportedCategories: Object.values(FileCategory),
      supportedFormats: Object.values(FileFormat),
      features: {
        batchUpload: true,
        contentValidation: true,
        checksumVerification: true,
        automaticCleanup: true,
        healthMonitoring: true,
        statisticsTracking: true
      }
    };
    
    return new MessageWithDataResponseDto(
      'Upload configuration retrieved successfully',
      config
    );
  }

  /**
   * Extract form value from multipart data 
   */
  private extractFormValue(field: any): string | undefined {
    if (!field) return undefined;
    
    // Handle Fastify multipart format
    if (typeof field === 'object' && field.value !== undefined) {
      return field.value;
    }
    
    // Handle direct value
    if (typeof field === 'string') {
      return field;
    }
    
    return undefined;
  }

  /**
   * Parse integer value with validation
   */
  private parseIntValue(value: string | undefined): number | undefined {
    if (!value) return undefined;
    
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  }

  /**
   * Parse boolean value from string
   */
  private parseBooleanValue(value: string | undefined): boolean | undefined {
    if (!value) return undefined;
    
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    
    return undefined;
  }
}
