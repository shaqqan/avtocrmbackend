import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsAudiobookService } from './reviews-audiobook.service';
import { CreateReviewsAudiobookDto } from './dto/request/create-reviews-audiobook.dto';
import { UpdateReviewsAudiobookDto } from './dto/request/update-reviews-audiobook.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';

@Controller('admin/reviews-audiobook')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('🎧 Audiobook Reviews')
@ApiBearerAuth()
@ApiGlobalResponses()
export class ReviewsAudiobookController {
  constructor(private readonly reviewsAudiobookService: ReviewsAudiobookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review audiobook' })
  create(@Body() createReviewsAudiobookDto: CreateReviewsAudiobookDto) {
    return this.reviewsAudiobookService.create(createReviewsAudiobookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all review audiobooks with pagination' })
  findAll(@Query() query: BasePaginationDto) {
    return this.reviewsAudiobookService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review audiobook by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsAudiobookService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review audiobook by ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewsAudiobookDto: UpdateReviewsAudiobookDto) {
    return this.reviewsAudiobookService.update(id, updateReviewsAudiobookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review audiobook by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsAudiobookService.remove(id);
  }
}
