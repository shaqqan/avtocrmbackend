import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';

type UserWithRelations = User & {
  roles: { role: { name: string } }[];
  permissions: { permission: { name: string } }[];
};

export class GetMeResponseDto {
  constructor(user: UserWithRelations) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.roles = user.roles.map((role) => role.role.name);
    this.permissions = user.permissions.map(
      (permission) => permission.permission.name,
    );
  }

  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  lastName: string;

  @ApiProperty({ type: [String] })
  roles?: string[];

  @ApiProperty({ type: [String] })
  permissions?: string[];
}
