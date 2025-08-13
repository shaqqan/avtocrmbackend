import { Role } from 'src/databases/typeorm/entities';

export class UserResponseDto {
  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public email: string,
    public roles: Role[],
    public createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.roles = roles;
    this.createdAt = createdAt;
  }
}
