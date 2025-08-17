import { PaginateConfig } from 'nestjs-paginate';

/**
 * Common pagination configuration creator for basic entities
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
 * User entity pagination configuration
 * Fields: id, name, lastName, phone, createdAt, updatedAt
 * Relations: roles (ManyToMany)
 */
export const userPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'lastName', 'phone', 'createdAt', 'updatedAt'],
  ['name', 'lastName', 'phone'],
  {
    name: true,
    lastName: true,
    phone: true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Auto Brand entity pagination configuration
 * Fields: id, name, createdAt, updatedAt
 * Relations: models (OneToMany)
 */
export const autoBrandPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'createdAt', 'updatedAt'],
  ['name'],
  {
    name: true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Customer entity pagination configuration
 * Fields: id, pinfl, firstName, lastName, middleName, phoneNumber, address, createdAt, updatedAt
 * Relations: none
 */
export const customerPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'pinfl', 'firstName', 'lastName', 'middleName', 'phoneNumber', 'address', 'createdAt', 'updatedAt'],
  ['firstName', 'lastName', 'middleName', 'phoneNumber', 'address'],
  {
    firstName: true,
    lastName: true,
    middleName: true,
    phoneNumber: true,
    address: true,
    pinfl: true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Auto Model entity pagination configuration
 * Fields: id, name, brandId, createdAt, updatedAt
 * Relations: brand (ManyToOne), positions (OneToMany), autoColors (OneToMany)
 */
export const autoModelPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'brandId', 'createdAt', 'updatedAt'],
  ['name'],
  {
    name: true,
    brandId: true,
    'brand.name': true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Auto Color entity pagination configuration
 * Fields: id, name, autoModelId, createdAt, updatedAt
 * Relations: autoModel (ManyToOne)
 */
export const autoColorPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'autoModelId', 'createdAt', 'updatedAt'],
  ['name'],
  {
    name: true,
    autoModelId: true,
    'autoModel.name': true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Auto Position entity pagination configuration
 * Fields: id, name, autoModelId, createdAt, updatedAt
 * Relations: autoModel (ManyToOne)
 */
export const autoPositionPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'autoModelId', 'createdAt', 'updatedAt'],
  ['name'],
  {
    name: true,
    autoModelId: true,
    'autoModel.name': true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Role entity pagination configuration
 * Fields: id, name, createdAt, updatedAt
 * Relations: users (ManyToMany), permissions (ManyToMany)
 */
export const rolePaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'createdAt', 'updatedAt'],
  ['name'],
  {
    name: true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Permission entity pagination configuration
 * Fields: id, name (JSON), action, createdAt, updatedAt
 * Relations: roles (ManyToMany)
 */
export const permissionPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'action', 'createdAt', 'updatedAt'],
  ['action'],
  {
    action: true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Language entity pagination configuration
 * Fields: id, name, locale, iconId, createdAt, updatedAt
 * Relations: icon (ManyToOne)
 */
export const languagePaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'locale', 'createdAt', 'updatedAt'],
  ['name', 'locale'],
  {
    name: true,
    locale: true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Warehouse entity pagination configuration
 * Fields: id, name, address, location, createdAt, updatedAt
 * Relations: stocks (OneToMany)
 */
export const warehousePaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'name', 'address', 'createdAt', 'updatedAt'],
  ['name', 'address'],
  {
    name: true,
    address: true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Stock entity pagination configuration
 * Fields: id, warehouseId, autoModelId, autoColorId, autoPositionId, bodyNumber, arrivalDate, factoryPrice, status, createdAt, updatedAt
 * Relations: warehouse (ManyToOne), autoModel (ManyToOne), autoColor (ManyToOne), autoPosition (ManyToOne)
 */
export const stockPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'bodyNumber', 'arrivalDate', 'factoryPrice', 'status', 'createdAt', 'updatedAt'],
  ['bodyNumber'],
  {
    bodyNumber: true,
    status: true,
    warehouseId: true,
    autoModelId: true,
    autoColorId: true,
    autoPositionId: true,
    'warehouse.name': true,
    'autoModel.name': true,
    'autoColor.name': true,
    'autoPosition.name': true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Order entity pagination configuration
 * Fields: id, customerId, autoModelId, autoPositionId, autoColorId, contractCode, state, queueNumber, amountDue, orderDate, price, expectedDeliveryDate, statusChangedAt, frozen, paidPercentage, createdAt, updatedAt
 * Relations: customer (ManyToOne), autoModel (ManyToOne), autoPosition (ManyToOne), autoColor (ManyToOne)
 */
export const orderPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'contractCode', 'state', 'queueNumber', 'amountDue', 'orderDate', 'price', 'expectedDeliveryDate', 'statusChangedAt', 'frozen', 'paidPercentage', 'createdAt', 'updatedAt'],
  ['contractCode'],
  {
    contractCode: true,
    state: true,
    frozen: true,
    customerId: true,
    autoModelId: true,
    autoPositionId: true,
    autoColorId: true,
    'customer.firstName': true,
    'customer.lastName': true,
    'autoModel.name': true,
    'autoPosition.name': true,
    'autoColor.name': true,
  },
  [['createdAt', 'DESC']],
);

/**
 * Price List entity pagination configuration
 * Fields: id, autoModelId, autoColorId, autoPositionId, basePrice, wholesalePrice, retailPrice, vat, margin, validFrom, validTo, isActive, createdAt, updatedAt
 * Relations: autoModel (ManyToOne), autoColor (ManyToOne), autoPosition (ManyToOne)
 */
export const priceListPaginateConfig: PaginateConfig<any> = createBasePaginateConfig(
  ['id', 'basePrice', 'wholesalePrice', 'retailPrice', 'vat', 'margin', 'validFrom', 'validTo', 'isActive', 'createdAt', 'updatedAt'],
  [],
  {
    isActive: true,
    autoModelId: true,
    autoColorId: true,
    autoPositionId: true,
    'autoModel.name': true,
    'autoColor.name': true,
    'autoPosition.name': true,
  },
  [['createdAt', 'DESC']],
);