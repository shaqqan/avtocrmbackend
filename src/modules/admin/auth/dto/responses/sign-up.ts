import { IsPhoneNumber, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
