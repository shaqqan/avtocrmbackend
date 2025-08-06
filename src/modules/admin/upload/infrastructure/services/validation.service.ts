import { Injectable, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import * as path from 'path';
import { FileCategory, FileFormat } from 'src/common/enums';
import {
  IFileValidationService,
  IValidationRule,
  IValidationConfig,
} from '../../domain/interfaces/validation.interface';

@Injectable()
export class FileValidationService implements IFileValidationService {
  private readonly validationConfig: IValidationConfig;

  constructor(private readonly i18n: I18nService) {
    this.validationConfig = this.buildValidationConfig();
  }

  async validateFile(
    mimetype: string,
    size: number,
    filename: string,
    category: FileCategory,
    format: FileFormat,
  ): Promise<void> {
    const rules = this.getValidationRules(category);

    // Validate mimetype
    if (!rules.allowedMimeTypes.includes(mimetype)) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.INVALID_MIME_TYPE', {
          args: {
            allowed: rules.allowedMimeTypes.join(', '),
            received: mimetype,
          },
        }),
      );
    }

    // Validate file size
    if (size > rules.maxFileSize) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.FILE_TOO_LARGE', {
          args: {
            maxSize: this.formatFileSize(rules.maxFileSize),
            actualSize: this.formatFileSize(size),
          },
        }),
      );
    }

    if (size <= 0) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.INVALID_FILE_SIZE'),
      );
    }

    // Validate file extension
    const extension = path.extname(filename).toLowerCase();
    if (!rules.allowedExtensions.includes(extension)) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.INVALID_FILE_EXTENSION', {
          args: {
            allowed: rules.allowedExtensions.join(', '),
            received: extension || 'none',
          },
        }),
      );
    }

    // Validate format-extension consistency
    if (!this.validateFormatExtension(filename, format)) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.FORMAT_EXTENSION_MISMATCH', {
          args: {
            format,
            extension: extension || 'none',
          },
        }),
      );
    }
  }

  getValidationRules(category: FileCategory): IValidationRule {
    const config = this.validationConfig[category];
    if (!config) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.UNSUPPORTED_CATEGORY', {
          args: { category },
        }),
      );
    }
    return config;
  }

  validateFormatExtension(filename: string, format: FileFormat): boolean {
    const extension = path.extname(filename).toLowerCase().substring(1); // Remove dot

    const formatExtensionMap: Record<FileFormat, string[]> = {
      [FileFormat.EPUB]: ['epub'],
      [FileFormat.PDF]: ['pdf'],
      [FileFormat.FB2]: ['fb2'],
      [FileFormat.PNG]: ['png'],
      [FileFormat.JPG]: ['jpg'],
      [FileFormat.JPEG]: ['jpeg', 'jpg'],
      [FileFormat.MP3]: ['mp3'],
    };

    const allowedExtensions = formatExtensionMap[format];
    return allowedExtensions ? allowedExtensions.includes(extension) : false;
  }

  private buildValidationConfig(): IValidationConfig {
    return {
      [FileCategory.EBOOK]: {
        allowedMimeTypes: [
          'application/epub+zip',
          'application/pdf',
          'application/x-fictionbook+xml',
          'text/xml',
        ],
        maxFileSize: 50 * 1024 * 1024, // 50MB for ebooks
        allowedExtensions: ['.epub', '.pdf', '.fb2'],
      },
      [FileCategory.AUDIOBOOK]: {
        allowedMimeTypes: ['audio/mpeg', 'audio/mp3'],
        maxFileSize: 50 * 1024 * 1024, // 50MB for audiobooks
        allowedExtensions: ['.mp3'],
      },
      [FileCategory.AUDIOBOOKS]: {
        allowedMimeTypes: ['audio/mpeg', 'audio/mp3'],
        maxFileSize: 50 * 1024 * 1024, // 50MB for audiobooks
        allowedExtensions: ['.mp3'],
      },
      [FileCategory.COVER]: {
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
        maxFileSize: 10 * 1024 * 1024, // 10MB for covers
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
      },
      [FileCategory.NEWS_IMAGE]: {
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
        maxFileSize: 10 * 1024 * 1024, // 10MB for news images
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
      },
      [FileCategory.BOOKS]: {
        allowedMimeTypes: [
          'application/epub+zip',
          'application/pdf',
          'application/x-fictionbook+xml',
          'text/xml',
        ],
        maxFileSize: 100 * 1024 * 1024, // 100MB for books
        allowedExtensions: ['.epub', '.pdf', '.fb2'],
      },
      [FileCategory.AUTHOR_COVER]: {
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
        maxFileSize: 10 * 1024 * 1024, // 10MB for author covers
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
      },
      [FileCategory.GENRE_COVER]: {
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
        maxFileSize: 10 * 1024 * 1024, // 10MB for genre covers
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
      },
      [FileCategory.LANGUAGE_ICON]: {
        allowedMimeTypes: [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/svg+xml',
        ],
        maxFileSize: 5 * 1024 * 1024, // 5MB for language icons
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.svg'],
      },
    };
  }

  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Advanced validation for specific file types
   */
  async validateFileContent(buffer: Buffer, mimetype: string): Promise<void> {
    try {
      switch (mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
          await this.validateJpegFile(buffer);
          break;
        case 'image/png':
          await this.validatePngFile(buffer);
          break;
        case 'application/pdf':
          await this.validatePdfFile(buffer);
          break;
        case 'audio/mpeg':
        case 'audio/mp3':
          await this.validateMp3File(buffer);
          break;
        default:
          // Basic validation for other file types
          await this.validateGenericFile(buffer);
      }
    } catch (error) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.CORRUPTED_FILE', {
          args: { reason: error.message },
        }),
      );
    }
  }

  private async validateJpegFile(buffer: Buffer): Promise<void> {
    // Check JPEG magic numbers
    if (buffer.length < 2 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
      throw new Error('Invalid JPEG file header');
    }
  }

  private async validatePngFile(buffer: Buffer): Promise<void> {
    // Check PNG magic numbers
    const pngSignature = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    if (buffer.length < 8 || !buffer.subarray(0, 8).equals(pngSignature)) {
      throw new Error('Invalid PNG file header');
    }
  }

  private async validatePdfFile(buffer: Buffer): Promise<void> {
    // Check PDF magic numbers
    if (buffer.length < 5 || buffer.toString('ascii', 0, 5) !== '%PDF-') {
      throw new Error('Invalid PDF file header');
    }
  }

  private async validateMp3File(buffer: Buffer): Promise<void> {
    // Check MP3 magic numbers (ID3 or MPEG sync)
    if (buffer.length < 3) {
      throw new Error('File too small to be valid MP3');
    }

    const hasId3 = buffer.toString('ascii', 0, 3) === 'ID3';
    const hasMpegSync = buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;

    if (!hasId3 && !hasMpegSync) {
      throw new Error('Invalid MP3 file header');
    }
  }

  private async validateGenericFile(buffer: Buffer): Promise<void> {
    if (buffer.length === 0) {
      throw new Error('Empty file');
    }
  }
}
