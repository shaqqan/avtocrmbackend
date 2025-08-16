import { Role } from 'src/databases/typeorm/entities';

export class UserResponseDto {
  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public phone: string,
    public roles: Role[],
    public createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.phone = phone;
    this.roles = roles;
    this.createdAt = createdAt;
  }
}
