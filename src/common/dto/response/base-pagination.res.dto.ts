import { ApiProperty } from '@nestjs/swagger';
import { Paginated } from 'nestjs-paginate';

class Meta {
  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Limit number',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Has next page',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Has previous page',
    example: true,
  })
  hasPreviousPage: boolean;
}

// Legacy response DTO for backward compatibility
export class BasePaginationResponseDto<T> {
  constructor(
    public data: T[],
    public meta: {
      total: number;
      page: number;
      limit: number;
    },
  ) {
    this.data = data;
    this.meta = {
      total: meta.total,
      page: meta.page,
      limit: meta.limit,
      totalPages: Math.ceil(meta.total / meta.limit),
      hasNextPage: meta.page < Math.ceil(meta.total / meta.limit),
      hasPreviousPage: meta.page > 1,
    } as Meta;
  }
}

// Re-export nestjs-paginate types for convenience
export { Paginated } from 'nestjs-paginate';
