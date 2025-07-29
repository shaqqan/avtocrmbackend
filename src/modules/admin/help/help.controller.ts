import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HelpService } from './help.service';
import { CreateHelpDto } from './dto/request/create-help.dto';
import { UpdateHelpDto } from './dto/request/update-help.dto';
import { BasePaginationDto } from 'src/common/dto/request';

@Controller('admin/help')
export class HelpController {
  constructor(private readonly helpService: HelpService) { }

  @Post()
  create(@Body() createHelpDto: CreateHelpDto) {
    return this.helpService.create(createHelpDto);
  }

  @Get()
  findAll(@Query() query: BasePaginationDto) {
    return this.helpService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.helpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHelpDto: UpdateHelpDto) {
    return this.helpService.update(+id, updateHelpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.helpService.remove(+id);
  }
}
