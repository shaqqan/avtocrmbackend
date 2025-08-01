import { PartialType } from '@nestjs/swagger';
import { CreateBookAudiobookLinkDto } from './create-book-audiobook-link.dto';

export class UpdateBookAudiobookLinkDto extends PartialType(CreateBookAudiobookLinkDto) {}