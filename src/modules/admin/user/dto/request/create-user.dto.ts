import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsArray, IsNumber } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: 'User name', example: 'John Doe', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'User last name', example: 'Doe', required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ description: 'User email address', example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'User password', example: 'SecurePassword123!' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ description: 'Role IDs to assign to user', example: [1, 2], required: false })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    roleIds?: number[];
}
