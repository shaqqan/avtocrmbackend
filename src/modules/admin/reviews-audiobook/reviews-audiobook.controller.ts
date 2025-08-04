import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsAudiobookService } from './reviews-audiobook.service';
import { CreateReviewsAudiobookDto } from './dto/request/create-reviews-audiobook.dto';
import { UpdateReviewsAudiobookDto } from './dto/request/update-reviews-audiobook.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/common/enums';
import { PermissionsGuard } from 'src/common/guards';

@Controller('admin/reviews-audiobook')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiTags('🎧 Audiobook Reviews')
@ApiBearerAuth()
@ApiGlobalResponses()
export class ReviewsAudiobookController {
  constructor(private readonly reviewsAudiobookService: ReviewsAudiobookService) {}

  @Post()
  @RequirePermissions(PermissionsEnum.CREATE_AUDIOBOOK_REVIEW)
  @ApiOperation({ summary: 'Create a new review audiobook' })
  create(@Body() createReviewsAudiobookDto: CreateReviewsAudiobookDto) {
    return this.reviewsAudiobookService.create(createReviewsAudiobookDto);
  }

  @Get()
  @RequirePermissions(PermissionsEnum.READ_AUDIOBOOK_REVIEW)
  @ApiOperation({ summary: 'Get all review audiobooks with pagination' })
  findAll(@Query() query: BasePaginationDto) {
    return this.reviewsAudiobookService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionsEnum.READ_AUDIOBOOK_REVIEW)
  @ApiOperation({ summary: 'Get a review audiobook by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsAudiobookService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsEnum.UPDATE_AUDIOBOOK_REVIEW)
  @ApiOperation({ summary: 'Update a review audiobook by ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewsAudiobookDto: UpdateReviewsAudiobookDto) {
    return this.reviewsAudiobookService.update(id, updateReviewsAudiobookDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionsEnum.DELETE_AUDIOBOOK_REVIEW)
  @ApiOperation({ summary: 'Delete a review audiobook by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsAudiobookService.remove(id);
  }
}
