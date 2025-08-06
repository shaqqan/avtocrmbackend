import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateIssuerDto {
  @ApiProperty({
    description: 'Issuer name in Uzbek',
    example: "O'zbekiston Nashriyoti",
    required: false,
  })
  @IsOptional()
  @IsString()
  name_uz?: string;

  @ApiProperty({
    description: 'Issuer name in Russian',
    example: 'Узбекистан Издательство',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({
    description: 'Issuer name in English',
    example: 'Uzbekistan Publishing',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;
}
