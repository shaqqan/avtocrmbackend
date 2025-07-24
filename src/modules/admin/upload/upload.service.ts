import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FastifyRequest } from 'fastify';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadTypeEnum } from 'src/common/enums/admin';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class UploadService {
  constructor(
    private readonly i18n: I18nService,
    private readonly prisma: PrismaService,
  ) { }

  async uploadFile(
    req: FastifyRequest,
    { type }: UploadFileDto,
  ): Promise<MessageWithDataResponseDto> {
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
    const typeDir = path.join(baseDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }

    const extension = path.extname(file.filename);
    const filename = `${uuidv4()}${extension}`;
    const fullPath = path.join(typeDir, filename);

    try {
      fs.writeFileSync(fullPath, buffer);

      const upload = await this.prisma.upload.create({
        data: {
          name: filename,
          originalName: file.filename,
          path: path.join('storage', type, filename),
          mimetype: file.mimetype,
          size: buffer.length,
          type,
        },
      });

      return new MessageWithDataResponseDto(this.i18n.t('success.UPLOAD.UPLOADED'), upload);
    } catch (error) {
      throw new BadRequestException(
        error?.message || this.i18n.t('errors.VALIDATION.FILE_UPLOAD_FAILED'),
      );
    }
  }
}
