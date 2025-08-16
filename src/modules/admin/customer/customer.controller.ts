import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/request/create-customer.dto';
import { UpdateCustomerDto } from './dto/request/update-customer.dto';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/databases/typeorm/entities';
import { PermissionsGuard } from 'src/common/guards';

@ApiTags('Admin - Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@Controller('admin/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - PINFL already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @GetUser() user: User,
  ) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Query() query: BasePaginationDto) {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - PINFL already exists',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @GetUser() user: User,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.customerService.remove(+id);
  }
}
