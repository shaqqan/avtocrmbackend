import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BasePaginationResponseDto } from 'src/common/dto/response/base-pagination.res.dto';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  constructor() {
    super({
      errorFormat: 'minimal',
    });

  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }


  public async findManyWithPagination(
    options: {
      model: keyof PrismaClient;
      query: BasePaginationDto;
      searchFields?: string[];
      selectFields?: Record<string, boolean>;
      includeFields?: Record<string, any>;
      allowedSortFields?: string[];
    }
  ): Promise<BasePaginationResponseDto> {
    const {
      model,
      query,
      searchFields = ['id'],
      selectFields,
      includeFields,
      allowedSortFields = ['id', 'createdAt', 'updatedAt']
    } = options;

    const { search, sortBy, sortOrder, take, skip, page = 1, limit = 10 } = query;

    const sortField = sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const where = search?.trim()
      ? {
        OR: searchFields.map(field => ({
          [field]: { contains: search.trim(), mode: 'insensitive' }
        })),
      }
      : {};

    const findManyArgs: any = {
      where,
      skip,
      take,
      orderBy: { [sortField]: sortOrder || SortOrder.DESC },
    };

    if (selectFields) {
      findManyArgs.select = selectFields;
    }

    if (includeFields) {
      findManyArgs.include = includeFields;
    }

    const modelDelegate = (this as any)[model];

    const [total, data] = await Promise.all([
      modelDelegate.count({ where }),
      modelDelegate.findMany(findManyArgs),
    ]);

    return new BasePaginationResponseDto(data, {
      total,
      page,
      limit,
    });
  }
}