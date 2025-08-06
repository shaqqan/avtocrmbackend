import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import {
  LinkTypeEnum,
  LinkStatusEnum,
} from '../../../../../databases/typeorm/entities/book-audiobook-link.entity';
import { Book } from '../../../../../databases/typeorm/entities/book.entity';
import { AudioBook } from '../../../../../databases/typeorm/entities/audio-book.entity';
import { BasePaginationDto } from 'src/common/dto/request';
import { Exists } from 'src/common/decorators/validators';

export class QueryBookAudiobookLinkDto extends BasePaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by Book ID',
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Exists(Book, 'id')
  bookId?: number;

  @ApiPropertyOptional({
    description: 'Filter by AudioBook ID',
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Exists(AudioBook, 'id')
  audiobookId?: number;

  @ApiPropertyOptional({
    description: 'Filter by link type',
    enum: LinkTypeEnum,
  })
  @IsOptional()
  @IsEnum(LinkTypeEnum)
  linkType?: LinkTypeEnum;

  @ApiPropertyOptional({
    description: 'Filter by link status',
    enum: LinkStatusEnum,
  })
  @IsOptional()
  @IsEnum(LinkStatusEnum)
  status?: LinkStatusEnum;
}
