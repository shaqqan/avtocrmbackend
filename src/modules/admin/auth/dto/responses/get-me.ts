import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from 'generated/prisma';

export class GetMeResponseDto {
    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
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
}