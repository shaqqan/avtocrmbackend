import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { IssuerService } from './issuer.service';
import { CreateIssuerDto } from './dto/request/create-issuer.dto';
import { UpdateIssuerDto } from './dto/request/update-issuer.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/common/enums';
import { PermissionsGuard } from 'src/common/guards';

@Controller('admin/issuer')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiTags('🏢 Issuer')
@ApiBearerAuth()
@ApiGlobalResponses()
export class IssuerController {
  constructor(private readonly issuerService: IssuerService) {}

  @Post()
  @RequirePermissions(PermissionsEnum.CREATE_ISSUER)
  @ApiOperation({ summary: 'Create a new issuer' })
  async create(@Body() createIssuerDto: CreateIssuerDto) {
    return this.issuerService.create(createIssuerDto);
  }

  @Get()
  @RequirePermissions(PermissionsEnum.READ_ISSUER)
  @ApiOperation({ summary: 'Get all issuers with pagination' })
  async findAll(@Query() query: BasePaginationDto) {
    return this.issuerService.findAll(query);
  }

  @Get('list')
  @RequirePermissions(PermissionsEnum.READ_ISSUER)
  @ApiOperation({ summary: 'Get all issuers list' })
  async list() {
    return this.issuerService.list();
  }

  @Get(':id')
  @RequirePermissions(PermissionsEnum.READ_ISSUER)
  @ApiOperation({ summary: 'Get an issuer by ID' })
  async findOne(@Param('id') id: string) {
    return this.issuerService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsEnum.UPDATE_ISSUER)
  @ApiOperation({ summary: 'Update an issuer by ID' })
  async update(@Param('id') id: string, @Body() updateIssuerDto: UpdateIssuerDto) {
    return this.issuerService.update(+id, updateIssuerDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionsEnum.DELETE_ISSUER)
  @ApiOperation({ summary: 'Delete an issuer by ID' })
  async remove(@Param('id') id: string) {
    return this.issuerService.remove(+id);
  }
}
