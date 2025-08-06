import { ApiProperty } from '@nestjs/swagger';
import {
  LinkTypeEnum,
  LinkStatusEnum,
} from '../../../../../databases/typeorm/entities/book-audiobook-link.entity';

export class BookAudiobookLinkResponseDto {
  constructor(
    public id: number,
    public bookId: number,
    public audiobookId: number,
    public linkType: LinkTypeEnum,
    public status: LinkStatusEnum,
    public description: string,
    public priority: number,
    public createdAt: Date,
    public updatedAt: Date,
    public book?: {
      id: number;
      name_uz: string;
      name_ru: string;
      name_en: string;
      cover: string;
      year: number;
      published: string;
    },
    public audiobook?: {
      id: number;
      name_uz: string;
      name_ru: string;
      name_en: string;
      cover: string;
      year: number;
      published: string;
      duration: number;
    },
  ) {
    // Add property decorators inline above constructor
  }
}

export class BookAudiobookLinkSummaryDto {
  constructor(
    public id: number,
    public bookId: number,
    public audiobookId: number,
    public linkType: LinkTypeEnum,
    public status: LinkStatusEnum,
    public priority: number,
    public bookName: string,
    public audiobookName: string,
    public createdAt: Date,
  ) {
    // Add property decorators inline above constructor
  }
}
