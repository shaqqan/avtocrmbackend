import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ReviewBookService } from './review-book.service';
import { CreateReviewBookDto } from './dto/request/create-review-book.dto';
import { UpdateReviewBookDto } from './dto/request/update-review-book.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { User } from 'src/databases/typeorm/entities';
import { GetUser } from 'src/common/decorators';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';

@Controller('admin/review-book')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('⭐ Book Reviews')
@ApiBearerAuth()
@ApiGlobalResponses()
export class ReviewBookController {
  constructor(private readonly reviewBookService: ReviewBookService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new review book' })
  create(@Body() createReviewBookDto: CreateReviewBookDto, @GetUser() user: User) {
    return this.reviewBookService.create(createReviewBookDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all review books with pagination' })
  findAll(@Query() query: BasePaginationDto) {
    return this.reviewBookService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review book by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewBookService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review book by ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewBookDto: UpdateReviewBookDto, @GetUser() user: User) {
    return this.reviewBookService.update(id, updateReviewBookDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review book by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewBookService.remove(id);
  }
}
