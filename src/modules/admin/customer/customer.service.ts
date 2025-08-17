import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Customer } from 'src/databases/typeorm/entities';
import { CreateCustomerDto } from './dto/request/create-customer.dto';
import { UpdateCustomerDto } from './dto/request/update-customer.dto';
import { CustomerMapper } from './mapper/customer.mapper';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { MessageWithDataResponseDto } from 'src/common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from 'src/common/dto/response/message.res.dto';
import { paginate, FilterOperator, FilterSuffix } from 'nestjs-paginate';
import { convertPaginatedResult } from 'src/common/utils/pagination.util';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly i18n: I18nService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // Check if PINFL already exists
    const existingCustomer = await this.customerRepository.findOne({
      where: { pinfl: createCustomerDto.pinfl },
    });

    if (existingCustomer) {
      throw new BadRequestException(
        this.i18n.t('errors.CUSTOMER.PINFL_ALREADY_EXISTS'),
      );
    }

    // Create customer entity
    const customer = CustomerMapper.toEntityFromCreateDto(createCustomerDto);
    const savedCustomer = await this.customerRepository.save(customer);

    return new MessageWithDataResponseDto(
      this.i18n.t('success.CUSTOMER.CREATED'),
      CustomerMapper.toDto(savedCustomer),
    );
  }

  async findAll(query: BasePaginationDto) {
    const result = await paginate(query, this.customerRepository, {
      sortableColumns: ['id', 'pinfl', 'firstName', 'lastName', 'middleName', 'phoneNumber', 'address', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['pinfl', 'firstName', 'lastName', 'middleName', 'phoneNumber', 'address'],
      select: ['id', 'pinfl', 'firstName', 'lastName', 'middleName', 'phoneNumber', 'address', 'createdAt', 'updatedAt'],
      filterableColumns: {
        pinfl: [FilterOperator.EQ, FilterSuffix.NOT],
        firstName: [FilterOperator.EQ, FilterSuffix.NOT],
        lastName: [FilterOperator.EQ, FilterSuffix.NOT],
        middleName: [FilterOperator.EQ, FilterSuffix.NOT],
        phoneNumber: [FilterOperator.EQ, FilterSuffix.NOT],
        address: [FilterOperator.EQ, FilterSuffix.NOT],
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return convertPaginatedResult(result, CustomerMapper.toDtoList);
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(this.i18n.t('errors.CUSTOMER.NOT_FOUND'));
    }

    return CustomerMapper.toDto(customer);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(this.i18n.t('errors.CUSTOMER.NOT_FOUND'));
    }

    // Check if PINFL already exists if it's being changed
    if (updateCustomerDto.pinfl && updateCustomerDto.pinfl !== customer.pinfl) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { pinfl: updateCustomerDto.pinfl },
      });

      if (existingCustomer) {
        throw new BadRequestException(
          this.i18n.t('errors.CUSTOMER.PINFL_ALREADY_EXISTS'),
        );
      }
    }

    // Update customer
    const updatedCustomer = CustomerMapper.toEntityFromUpdateDto(updateCustomerDto, customer);
    const savedCustomer = await this.customerRepository.save(updatedCustomer);

    return new MessageWithDataResponseDto(
      this.i18n.t('success.CUSTOMER.UPDATED'),
      CustomerMapper.toDto(savedCustomer),
    );
  }

  async remove(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(this.i18n.t('errors.CUSTOMER.NOT_FOUND'));
    }

    // Soft delete using TypeORM's soft delete feature
    await this.customerRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.CUSTOMER.DELETED'));
  }
}
