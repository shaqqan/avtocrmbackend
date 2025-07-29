import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { IssuerService } from './issuer.service';
import { CreateIssuerDto } from './dto/request/create-issuer.dto';
import { UpdateIssuerDto } from './dto/request/update-issuer.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';

@Controller('admin/issuer')
// @UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('🏢 Issuer')
// @ApiBearerAuth()
@ApiGlobalResponses()
export class IssuerController {
  constructor(private readonly issuerService: IssuerService) {}

  @Post()
  create(@Body() createIssuerDto: CreateIssuerDto) {
    return this.issuerService.create(createIssuerDto);
  }

  @Get()
  findAll(@Query() query: BasePaginationDto) {
    return this.issuerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIssuerDto: UpdateIssuerDto) {
    return this.issuerService.update(+id, updateIssuerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuerService.remove(+id);
  }

  @Get('list')
  list() {
    return this.issuerService.list();
  }
}
