import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { I18nService, i18nValidationMessage } from 'nestjs-i18n';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const maxSize = 1024 * 1024 * 5;
    if (value.size > maxSize) {
      throw new BadRequestException(
        i18nValidationMessage('errors.VALIDATION.FILE_SIZE_TOO_LARGE'),
      );
    }
    return value;
  }
}
