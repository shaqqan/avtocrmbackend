import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/request/create-news.dto';
import { UpdateNewsDto } from './dto/request/update-news.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/common/enums';
import { PermissionsGuard } from 'src/common/guards';

@Controller('admin/news')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiTags('📰 News')
@ApiBearerAuth()
@ApiGlobalResponses()
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  @RequirePermissions(PermissionsEnum.CREATE_NEWS)
  @ApiOperation({ summary: 'Create a new news' })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @RequirePermissions(PermissionsEnum.READ_NEWS)
  @ApiOperation({ summary: 'Get all news with pagination' })
  findAll(@Query() query: BasePaginationDto) {
    return this.newsService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionsEnum.READ_NEWS)
  @ApiOperation({ summary: 'Get a news by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsEnum.UPDATE_NEWS)
  @ApiOperation({ summary: 'Update a news by ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionsEnum.DELETE_NEWS)
  @ApiOperation({ summary: 'Delete a news by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.remove(id);
  }
}
