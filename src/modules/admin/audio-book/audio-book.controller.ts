import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AudioBookService } from './audio-book.service';
import { CreateAudioBookDto } from './dto/request/create-audio-book.dto';
import { UpdateAudioBookDto } from './dto/request/update-audio-book.dto';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { AudioBookResponseMultiLangDto } from './dto/response/audio-book.res.dto';
import { QueryAudioBookDto } from './dto/request/query-audio-book.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';

@Controller('admin/audio-book')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('🔉 AudioBooks')
@ApiBearerAuth()
@ApiGlobalResponses()
export class AudioBookController {
  constructor(private readonly audioBookService: AudioBookService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new audio book' })
  @ApiResponse({ status: 201, description: 'Audio book created successfully' })
  create(@Body() createAudioBookDto: CreateAudioBookDto): Promise<MessageWithDataResponseDto<AudioBookResponseMultiLangDto>> {
    return this.audioBookService.create(createAudioBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all audio books with pagination and search' })
  @ApiResponse({ status: 200, description: 'Audio books retrieved successfully' })
  findAll(@Query() query: QueryAudioBookDto) {
    return this.audioBookService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audio book by ID' })
  @ApiResponse({ status: 200, description: 'Audio book found' })
  @ApiResponse({ status: 404, description: 'Audio book not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.audioBookService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update audio book by ID' })
  @ApiResponse({ status: 200, description: 'Audio book updated successfully' })
  @ApiResponse({ status: 404, description: 'Audio book not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAudioBookDto: UpdateAudioBookDto) {
    return this.audioBookService.update(id, updateAudioBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete audio book by ID' })
  @ApiResponse({ status: 200, description: 'Audio book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Audio book not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.audioBookService.remove(id);
  }
}
