import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedbacksThemeService } from './feedbacks-theme.service';
import { CreateFeedbacksThemeDto } from './dto/request/create-feedbacks-theme.dto';
import { UpdateFeedbacksThemeDto } from './dto/request/update-feedbacks-theme.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';

@Controller('admin/feedbacks-theme')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('💬 Feedback Themes')
@ApiBearerAuth()
@ApiGlobalResponses()
export class FeedbacksThemeController {
  constructor(private readonly feedbacksThemeService: FeedbacksThemeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feedback theme' })
  @ApiResponse({
    status: 201,
    description: 'Feedback theme created successfully',
  })
  async create(@Body() createFeedbacksThemeDto: CreateFeedbacksThemeDto) {
    return this.feedbacksThemeService.create(createFeedbacksThemeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedback themes with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Feedback themes retrieved successfully',
  })
  async findAll(@Query() query: BasePaginationDto) {
    return this.feedbacksThemeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feedback theme by ID' })
  async findOne(@Param('id') id: string) {
    return this.feedbacksThemeService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a feedback theme by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateFeedbacksThemeDto: UpdateFeedbacksThemeDto,
  ) {
    return this.feedbacksThemeService.update(+id, updateFeedbacksThemeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feedback theme by ID' })
  async remove(@Param('id') id: string) {
    return this.feedbacksThemeService.remove(+id);
  }
}
