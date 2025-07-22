import { PartialType } from '@nestjs/swagger';
import { UploadFileDto } from './upload-file.dto';

export class UpdateUploadDto extends PartialType(UploadFileDto) {}
