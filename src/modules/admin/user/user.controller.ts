import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { BasePaginationDto } from 'src/common/dto/request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsEnum } from 'src/common/enums';
import { PermissionsGuard } from 'src/common/guards';

@Controller('admin/user')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiTags('👤 User')
@ApiBearerAuth()
@ApiGlobalResponses()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @RequirePermissions(PermissionsEnum.CREATE_USER)
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @RequirePermissions(PermissionsEnum.READ_USER)
  @ApiOperation({ summary: 'Get all users with pagination' })
  async findAll(@Query() query: BasePaginationDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionsEnum.READ_USER)
  @ApiOperation({ summary: 'Get a user by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsEnum.UPDATE_USER)
  @ApiOperation({ summary: 'Update a user by ID' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionsEnum.DELETE_USER)
  @ApiOperation({ summary: 'Delete a user by ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
