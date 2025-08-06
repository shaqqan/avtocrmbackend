import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { HelpService } from './help.service';
import { CreateHelpDto } from './dto/request/create-help.dto';
import { UpdateHelpDto } from './dto/request/update-help.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';

@Controller('admin/help')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('❓ Help')
@ApiBearerAuth()
@ApiGlobalResponses()
export class HelpController {
  constructor(private readonly helpService: HelpService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new help' })
  async create(@Body() createHelpDto: CreateHelpDto) {
    return this.helpService.create(createHelpDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all helps with pagination' })
  async findAll(@Query() query: BasePaginationDto) {
    return this.helpService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a help by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.helpService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a help by ID' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateHelpDto: UpdateHelpDto) {
    return this.helpService.update(id, updateHelpDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a help by ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.helpService.remove(id);
  }
}
