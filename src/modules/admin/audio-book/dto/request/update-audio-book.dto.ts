import { PartialType } from '@nestjs/swagger';
import { CreateAudioBookDto } from './create-audio-book.dto';

export class UpdateAudioBookDto extends PartialType(CreateAudioBookDto) {}
