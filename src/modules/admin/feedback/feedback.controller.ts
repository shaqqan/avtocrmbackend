import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, ValidationPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackService, PaginatedResult } from './feedback.service';
import { CreateFeedbackDto } from './dto/request/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/request/update-feedback.dto';
import { QueryFeedbackDto } from './dto/request/query-feedback.dto';
import { Feedback } from 'src/databases/typeorm/entities';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto } from 'src/common/dto/response';
import { FeedbackResponseDto } from './dto/response/feedback-response.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';

@Controller('admin/feedback')
@ApiTags('📪 Feedback')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiBearerAuth()
@ApiGlobalResponses()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully', type: Feedback })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  async create(@Body(ValidationPipe) createFeedbackDto: CreateFeedbackDto) {
    return await this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all with pagination feedback' })
  async findAll(@Query() query: BasePaginationDto): Promise<BasePaginationResponseDto<FeedbackResponseDto>> {
    return await this.feedbackService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FeedbackResponseDto> {
    return await this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update feedback by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateFeedbackDto: UpdateFeedbackDto
  ) {
    return await this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feedback by ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.feedbackService.remove(id);
  }
}
