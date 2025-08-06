import { Controller, Get } from '@nestjs/common';
import { AudioBookService } from './audio-book.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('core/audio-book')
@ApiTags('🎧 Audio Books')
export class AudioBookController {
  constructor(private readonly audioBookService: AudioBookService) {}

  @Get('by-rating')
  @ApiOperation({
    summary: 'Get top 50 audiobooks by rating',
    description:
      'Returns the top 50 published audiobooks sorted by their average review rating in descending order',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved top audiobooks by rating',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name_uz: { type: 'string' },
          name_ru: { type: 'string' },
          name_en: { type: 'string' },
          description_uz: { type: 'string' },
          description_ru: { type: 'string' },
          description_en: { type: 'string' },
          description_short_uz: { type: 'string' },
          description_short_ru: { type: 'string' },
          description_short_en: { type: 'string' },
          lang: { type: 'string', enum: ['uz', 'ru', 'en'] },
          year: { type: 'number' },
          ISBN: { type: 'string' },
          duration: { type: 'number' },
          published: { type: 'string', enum: ['0', '1'] },
          top: { type: 'number' },
          cover: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          averageRating: {
            type: 'number',
            description: 'Average rating from reviews (1-5 scale)',
          },
          reviewCount: { type: 'number', description: 'Number of reviews' },
          authors: {
            type: 'object',
            properties: {
              uz: { type: 'array', items: { type: 'string' } },
              ru: { type: 'array', items: { type: 'string' } },
              en: { type: 'array', items: { type: 'string' } },
            },
          },
          genres: {
            type: 'object',
            properties: {
              uz: { type: 'array', items: { type: 'string' } },
              ru: { type: 'array', items: { type: 'string' } },
              en: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
  })
  async byRating() {
    return this.audioBookService.byRating();
  }
}
