import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/request/create-language.dto';
import { UpdateLanguageDto } from './dto/request/update-language.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto } from 'src/common/dto/response/base-pagination.res.dto';
import { MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { LanguageResponseDto } from './dto/response/language.res.dto';

@Controller('admin/languages')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiBearerAuth()
@ApiTags('🌐 Language')
@ApiGlobalResponses()
export class LanguageController {
  constructor(private readonly languageService: LanguageService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new language' })
  create(@Body() createLanguageDto: CreateLanguageDto): Promise<MessageWithDataResponseDto<LanguageResponseDto>> {
    return this.languageService.create(createLanguageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all languages' })
  findAll(@Query() query: BasePaginationDto): Promise<BasePaginationResponseDto<LanguageResponseDto>> {
    return this.languageService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a language by id' })
  findOne(@Param('id', new ParseIntPipe()) id: number): Promise<LanguageResponseDto> {
    return this.languageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a language by id' })
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateLanguageDto: UpdateLanguageDto): Promise<MessageWithDataResponseDto<LanguageResponseDto>> {
    return this.languageService.update(id, updateLanguageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a language by id' })
  remove(@Param('id', new ParseIntPipe()) id: number): Promise<MessageResponseDto> {
    return this.languageService.remove(id);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all languages' })
  list(): Promise<LanguageResponseDto[]> {
    return this.languageService.list();
  }
}

