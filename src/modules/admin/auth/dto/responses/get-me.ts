import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/databases/typeorm/entities';

export class GetMeResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.phone = user.phone;
    this.name = user.name;
    this.lastName = user.lastName;
    this.roles = user.roles.map((role) => role.name);
    this.permissions = user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.action),
    );
  }

  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  lastName: string;

  @ApiProperty({ type: [String] })
  roles?: string[];

  @ApiProperty({ type: [String] })
  permissions?: string[];
}
