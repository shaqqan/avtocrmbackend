import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FastifyRequest } from 'fastify';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from 'src/databases/typeorm/entities';
import { UploadResponseDto } from './dto/response/upload.res.dto';
import { UploadMapper } from './mapper/upload.mapper';
import { FileCategory, FileFormat } from 'src/common/enums';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class UploadService {
  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(File)
    private readonly uploadRepository: Repository<File>,
  ) { }

  async uploadFile(
    req: FastifyRequest,
    { category, format }: { category: FileCategory, format: FileFormat },
  ): Promise<MessageWithDataResponseDto<UploadResponseDto>> {
    const file = await req.file();
    if (!file) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.FILE_REQUIRED'));
    }

    const buffer = await file.toBuffer();

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.INVALID_MIME_TYPE'));
    }

    if (buffer.length > MAX_FILE_SIZE) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.FILE_TOO_LARGE'));
    }

    const baseDir = path.join(process.cwd(), 'storage');
    const typeDir = path.join(baseDir, category);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }

    const extension = path.extname(file.filename);
    const filename = `${uuidv4()}${extension}`;
    const fullPath = path.join(typeDir, filename);

    try {
      fs.writeFileSync(fullPath, buffer);

      const upload = this.uploadRepository.create({
        title_uz: file.filename,
        title_ru: file.filename,
        title_en: file.filename,
        format: format,
        category: category,
        chapter: 0,
        duration: 0,
        size: buffer.length,
        isActive: true,
      });

      await this.uploadRepository.save(upload);

      return new MessageWithDataResponseDto(this.i18n.t('success.UPLOAD.UPLOADED'), UploadMapper.toDto(upload));
    } catch (error) {
      throw new BadRequestException(
        error?.message || this.i18n.t('errors.VALIDATION.FILE_UPLOAD_FAILED'),
      );
    }
  }
}
