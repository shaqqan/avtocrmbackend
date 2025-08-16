import { Customer } from 'src/databases/typeorm/entities';
import { CustomerResponseDto } from '../dto/response/customer.res.dto';
import { CreateCustomerDto } from '../dto/request/create-customer.dto';
import { UpdateCustomerDto } from '../dto/request/update-customer.dto';

export class CustomerMapper {
  static toDto(entity: Customer): CustomerResponseDto {
    return new CustomerResponseDto(
      entity.id,
      entity.pinfl,
      entity.firstName,
      entity.lastName,
      entity.middleName,
      entity.phoneNumber,
      entity.address,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: Customer[]): CustomerResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreateCustomerDto): Customer {
    const customer = new Customer();
    Object.assign(customer, dto);
    return customer;
  }

  static toEntityFromUpdateDto(dto: UpdateCustomerDto, existingCustomer: Customer): Customer {
    if (dto.pinfl !== undefined) existingCustomer.pinfl = dto.pinfl;
    if (dto.firstName !== undefined) existingCustomer.firstName = dto.firstName;
    if (dto.lastName !== undefined) existingCustomer.lastName = dto.lastName;
    if (dto.middleName !== undefined) existingCustomer.middleName = dto.middleName;
    if (dto.phoneNumber !== undefined) existingCustomer.phoneNumber = dto.phoneNumber;
    if (dto.address !== undefined) existingCustomer.address = dto.address;
    return existingCustomer;
  }
}
