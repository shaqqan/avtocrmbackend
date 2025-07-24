import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from '../../../databases/typeorm/entities/permission.entity';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto } from 'src/common/dto/response';

@Controller('admin/permissions')
@ApiTags('🔐 Permission')
@ApiBearerAuth()
@ApiGlobalResponses()
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new permission' })
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all permissions' })
    findAll(@Query() query: BasePaginationDto): Promise<BasePaginationResponseDto> {
        return this.permissionService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a permission by id' })
    @ApiResponse({ status: 200, type: Permission })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.permissionService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a permission' })
    @ApiResponse({ status: 200, type: Permission })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePermissionDto: UpdatePermissionDto,
    ) {
        return this.permissionService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a permission' })
    @ApiResponse({ status: 204 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.permissionService.remove(id);
    }
} 