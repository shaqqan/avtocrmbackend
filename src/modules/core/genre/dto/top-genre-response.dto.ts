import { ApiProperty } from '@nestjs/swagger';

export class TopGenreResponseDto {
  @ApiProperty({
    description: 'Genre name',
    example: 'Fiction',
  })
  name: string;

  @ApiProperty({
    description: 'Number of books in this genre',
    example: 150,
  })
  bookCount: number;

  @ApiProperty({
    description: 'Number of audiobooks in this genre',
    example: 75,
  })
  audioBookCount: number;
}
