import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/request/create-permission.dto';
import { UpdatePermissionDto } from './dto/request/update-permission.dto';
import { Permission } from '../../../databases/typeorm/entities/permission.entity';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { PermissionResponseDto } from './dto/response/permission.res.dto';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/common/enums';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { PermissionsGuard } from 'src/common/guards';

@Controller('admin/permissions')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiTags('🔐 Permission')
@ApiBearerAuth()
@ApiGlobalResponses()
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post()
    @RequirePermissions(PermissionsEnum.CREATE_PERMISSION)
    @ApiOperation({ summary: 'Create a new permission' })
    async create(@Body() createPermissionDto: CreatePermissionDto): Promise<MessageWithDataResponseDto<PermissionResponseDto>> {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    @RequirePermissions(PermissionsEnum.READ_PERMISSION)
    @ApiOperation({ summary: 'Get all permissions' })
    async findAll(@Query() query: BasePaginationDto): Promise<BasePaginationResponseDto<PermissionResponseDto>> {
        return this.permissionService.findAll(query);
    }

    @Get('list')
    @RequirePermissions(PermissionsEnum.READ_PERMISSION)
    @ApiOperation({ summary: 'Get all permissions' })
    async list(): Promise<PermissionResponseDto[]> {
        return this.permissionService.list();
    }

    @Get(':id')
    @RequirePermissions(PermissionsEnum.READ_PERMISSION)
    @ApiOperation({ summary: 'Get a permission by id' })
    @ApiResponse({ status: 200, type: Permission })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<PermissionResponseDto> {
        return this.permissionService.findOne(id);
    }

    @Patch(':id')
    @RequirePermissions(PermissionsEnum.UPDATE_PERMISSION)
    @ApiOperation({ summary: 'Update a permission' })
    @ApiResponse({ status: 200, type: Permission })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePermissionDto: UpdatePermissionDto,
    ): Promise<MessageWithDataResponseDto<PermissionResponseDto>> {
        return this.permissionService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    @RequirePermissions(PermissionsEnum.DELETE_PERMISSION)
    @ApiOperation({ summary: 'Delete a permission' })
    @ApiResponse({ status: 204 })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
        return this.permissionService.remove(id);
    }

} 