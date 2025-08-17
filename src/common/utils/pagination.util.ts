import { Paginated } from 'nestjs-paginate';
import { BasePaginationResponseDto } from '../dto/response/base-pagination.res.dto';

/**
 * Converts nestjs-paginate Paginated result to BasePaginationResponseDto format
 * for backward compatibility with existing controllers
 */
export function convertPaginatedResult<T>(
  paginatedResult: Paginated<T>,
  mapperFunction?: (items: T[]) => any[]
): BasePaginationResponseDto<any> {
  const mappedData = mapperFunction 
    ? mapperFunction(paginatedResult.data) 
    : paginatedResult.data;

  return new BasePaginationResponseDto(mappedData, {
    total: paginatedResult.meta.totalItems || 0,
    page: paginatedResult.meta.currentPage || 1,
    limit: paginatedResult.meta.itemsPerPage || 10,
  });
}