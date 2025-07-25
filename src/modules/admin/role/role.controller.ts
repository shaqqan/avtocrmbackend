import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { AssignPermissionDto } from './dto/request/assign-permission.dto';
import { RoleResponseDto } from './dto/response/role.res.dto';

@Controller('admin/role')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('🔒 Role')
@ApiBearerAuth()
@ApiGlobalResponses()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  create(@Body() createRoleDto: CreateRoleDto): Promise<MessageWithDataResponseDto<RoleResponseDto>> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  findAll(@Query() query: BasePaginationDto): Promise<BasePaginationResponseDto<RoleResponseDto>> {
    return this.roleService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by id' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role by id' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<MessageWithDataResponseDto<RoleResponseDto>> {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by id' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.roleService.remove(+id);
  }

  @Post(':id/assign-permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(@Param('id', ParseIntPipe) id: number, @Body() assignPermissionDto: AssignPermissionDto): Promise<MessageResponseDto> {
    return this.roleService.assignPermissions(+id, assignPermissionDto);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all roles' })
  list(): Promise<RoleResponseDto[]> {
    return this.roleService.list();
  }

}
