import { PaginateConfig } from 'nestjs-paginate';

/**
 * Common pagination configuration for basic entities
 */
export const createBasePaginateConfig = (
  sortableColumns: string[],
  searchableColumns: string[] = [],
  filterableColumns: Record<string, any> = {},
  defaultSortBy: [string, 'ASC' | 'DESC'][] = [['id', 'DESC']],
  maxLimit: number = 100,
  defaultLimit: number = 10,
): PaginateConfig<any> => ({
  sortableColumns,
  searchableColumns,
  defaultSortBy,
  filterableColumns,
  maxLimit,
  defaultLimit,
  nullSort: 'last',
});

/**
 * Default pagination config for entities with basic fields
 */
export const getDefaultPaginateConfig = (additionalSortable: string[] = []): PaginateConfig<any> => ({
  sortableColumns: ['id', 'createdAt', 'updatedAt', ...additionalSortable],
  searchableColumns: [],
  defaultSortBy: [['createdAt', 'DESC']],
  filterableColumns: {},
  maxLimit: 100,
  defaultLimit: 10,
  nullSort: 'last',
});

/**
 * User entity pagination configuration
 */
export const userPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'lastName', 'phone', 'createdAt', 'updatedAt'],
  ['name', 'lastName', 'phone'],
  {},
  [['createdAt', 'DESC']],
);

/**
 * Auto Brand entity pagination configuration
 */
export const autoBrandPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'createdAt', 'updatedAt'],
  ['name'],
  {},
  [['createdAt', 'DESC']],
);

/**
 * Customer entity pagination configuration
 */
export const customerPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'pinfl', 'firstName', 'lastName', 'middleName', 'phoneNumber', 'address', 'createdAt', 'updatedAt'],
  ['pinfl', 'firstName', 'lastName', 'middleName', 'phoneNumber', 'address'],
  {},
  [['createdAt', 'DESC']],
);

/**
 * Auto Model entity pagination configuration
 */
export const autoModelPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'createdAt', 'updatedAt'],
  ['name'],
  {
    'brand.id': true,
    'brand.name': true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Auto Color entity pagination configuration
 */
export const autoColorPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'hexColor', 'createdAt', 'updatedAt'],
  ['name', 'hexColor'],
  {
    'autoModel.id': true,
    'autoModel.name': true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Auto Position entity pagination configuration
 */
export const autoPositionPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'createdAt', 'updatedAt'],
  ['name'],
  {},
  [['createdAt', 'DESC']],
);

/**
 * Role entity pagination configuration
 */
export const rolePaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'createdAt', 'updatedAt'],
  ['name'],
  {},
  [['createdAt', 'DESC']],
);

/**
 * Permission entity pagination configuration
 */
export const permissionPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'action', 'subject', 'createdAt', 'updatedAt'],
  ['name', 'action', 'subject'],
  {
    action: true,
    subject: true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Language entity pagination configuration
 */
export const languagePaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'code', 'isDefault', 'createdAt', 'updatedAt'],
  ['name', 'code'],
  {
    isDefault: true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Warehouse entity pagination configuration
 */
export const warehousePaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'address', 'createdAt', 'updatedAt'],
  ['name', 'address'],
  {},
  [['createdAt', 'DESC']],
);

/**
 * Stock entity pagination configuration
 */
export const stockPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'quantity', 'createdAt', 'updatedAt'],
  [],
  {
    'warehouse.id': true,
    'warehouse.name': true,
    'autoColor.id': true,
    'autoColor.name': true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Order entity pagination configuration
 */
export const orderPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'totalAmount', 'status', 'createdAt', 'updatedAt'],
  [],
  {
    status: true,
    'customer.id': true,
    'customer.firstName': true,
    'customer.lastName': true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Price List entity pagination configuration
 */
export const priceListPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'price', 'isActive', 'createdAt', 'updatedAt'],
  [],
  {
    isActive: true,
    'autoColor.id': true,
    'autoColor.name': true,
  },
  [['createdAt', 'DESC']],
);