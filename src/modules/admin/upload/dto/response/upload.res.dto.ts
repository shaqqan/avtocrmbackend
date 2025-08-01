import { ApiProperty } from '@nestjs/swagger';
import { FileCategory, FileFormat } from "src/common/enums";

export class UploadResponseDto {
    @ApiProperty({ description: 'File ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'File name/path', example: 'ebook/abc-123.pdf' })
    name: string;

    @ApiProperty({ description: 'Original filename', example: 'document.pdf' })
    originalFilename: string;

    @ApiProperty({ description: 'File category', enum: FileCategory })
    category: FileCategory;

    @ApiProperty({ description: 'File format', enum: FileFormat })
    format: FileFormat;

    @ApiProperty({ description: 'File size in bytes', example: 1024000 })
    size: number;

    @ApiProperty({ description: 'MIME type', example: 'application/pdf' })
    mimetype: string;

    @ApiProperty({ description: 'Public URL', example: 'https://example.com/storage/ebook/abc-123.pdf' })
    publicUrl: string;

    @ApiProperty({ description: 'Title in Uzbek', required: false })
    titleUz?: string;

    @ApiProperty({ description: 'Title in Russian', required: false })
    titleRu?: string;

    @ApiProperty({ description: 'Title in English', required: false })
    titleEn?: string;

    @ApiProperty({ description: 'Chapter number', example: 1 })
    chapter: number;

    @ApiProperty({ description: 'Duration in seconds', example: 3600 })
    duration: number;

    @ApiProperty({ description: 'Language code', example: 'uzb' })
    lang: string;

    @ApiProperty({ description: 'File is active', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Creation date' })
    createdAt: Date;

    @ApiProperty({ description: 'File checksum (MD5)', required: false })
    checksum?: string;

    @ApiProperty({ description: 'File extension', example: 'pdf' })
    fileExtension: string;

    @ApiProperty({ description: 'Is image file', example: false })
    isImage: boolean;

    @ApiProperty({ description: 'Is audio file', example: false })
    isAudio: boolean;

    @ApiProperty({ description: 'Is document file', example: true })
    isDocument: boolean;

    constructor(data: Partial<UploadResponseDto>) {
        Object.assign(this, data);
    }
}

export class UploadStatsDto {
    @ApiProperty({ description: 'Total number of files', example: 150 })
    totalFiles: number;

    @ApiProperty({ description: 'Total size in bytes', example: 1073741824 })
    totalSize: number;

    @ApiProperty({ description: 'Total size formatted', example: '1.0 GB' })
    totalSizeFormatted: string;

    @ApiProperty({ description: 'Available storage space in bytes', example: 5368709120 })
    availableSpace: number;

    @ApiProperty({ description: 'Available space formatted', example: '5.0 GB' })
    availableSpaceFormatted: string;

    @ApiProperty({ description: 'Files by category' })
    filesByCategory: Record<FileCategory, number>;

    @ApiProperty({ description: 'Files by format' })
    filesByFormat: Record<FileFormat, number>;

    @ApiProperty({ description: 'Average file size in bytes', example: 7158272 })
    averageFileSize: number;

    @ApiProperty({ description: 'Latest upload date' })
    latestUpload?: Date;

    constructor(data: Partial<UploadStatsDto>) {
        Object.assign(this, data);
    }
}

export class BatchUploadResponseDto {
    @ApiProperty({ description: 'Successfully uploaded files', type: [UploadResponseDto] })
    successful: UploadResponseDto[];

    @ApiProperty({ description: 'Failed uploads with error messages' })
    failed: Array<{ filename: string; error: string }>;

    @ApiProperty({ description: 'Total files processed', example: 5 })
    totalProcessed: number;

    @ApiProperty({ description: 'Number of successful uploads', example: 4 })
    successCount: number;

    @ApiProperty({ description: 'Number of failed uploads', example: 1 })
    failureCount: number;

    @ApiProperty({ description: 'Total size of successful uploads in bytes', example: 10485760 })
    totalSize: number;

    @ApiProperty({ description: 'Processing time in milliseconds', example: 1500 })
    processingTime: number;

    constructor(data: Partial<BatchUploadResponseDto>) {
        Object.assign(this, data);
    }
}