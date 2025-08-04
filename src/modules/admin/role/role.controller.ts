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
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/common/enums';
import { PermissionsGuard } from 'src/common/guards';

@Controller('admin/role')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiTags('🔒 Role')
@ApiBearerAuth()
@ApiGlobalResponses()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @RequirePermissions(PermissionsEnum.CREATE_ROLE)
  @ApiOperation({ summary: 'Create a new role' })
  create(@Body() createRoleDto: CreateRoleDto): Promise<MessageWithDataResponseDto<RoleResponseDto>> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @RequirePermissions(PermissionsEnum.READ_ROLE)
  @ApiOperation({ summary: 'Get all roles' })
  findAll(@Query() query: BasePaginationDto): Promise<BasePaginationResponseDto<RoleResponseDto>> {
    return this.roleService.findAll(query);
  }

  @Get('list')
  @RequirePermissions(PermissionsEnum.READ_ROLE)
  @ApiOperation({ summary: 'Get all roles' })
  list(): Promise<RoleResponseDto[]> {
    return this.roleService.list();
  }

  @Post(':id/assign-permissions')
  @RequirePermissions(PermissionsEnum.UPDATE_ROLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(@Param('id', ParseIntPipe) id: number, @Body() assignPermissionDto: AssignPermissionDto): Promise<MessageResponseDto> {
    return this.roleService.assignPermissions(+id, assignPermissionDto);
  }

  @Get(':id')
  @RequirePermissions(PermissionsEnum.READ_ROLE)
  @ApiOperation({ summary: 'Get a role by id' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsEnum.UPDATE_ROLE)
  @ApiOperation({ summary: 'Update a role by id' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<MessageWithDataResponseDto<RoleResponseDto>> {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionsEnum.DELETE_ROLE)
  @ApiOperation({ summary: 'Delete a role by id' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.roleService.remove(+id);
  }

}
