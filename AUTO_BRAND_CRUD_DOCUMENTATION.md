# Auto Brand CRUD Operations Documentation

## Overview
This document describes the complete CRUD (Create, Read, Update, Delete) operations for the Auto Brand entity in the admin module.

## Entity Structure

### AutoBrand Entity
```typescript
@Entity('auto_brands')
export class AutoBrand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => AutoModels, (model) => model.brand)
  models: AutoModels[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
```

## API Endpoints

### Base URL
```
/admin/auto-brands
```

### Authentication
All endpoints require JWT authentication with admin access.

### 1. Create Auto Brand

**Endpoint:** `POST /admin/auto-brands`

**Request Body:**
```json
{
  "name": "Toyota"
}
```

**Response (201):**
```json
{
  "message": "Auto brand created successfully",
  "data": {
    "id": 1,
    "name": "Toyota",
    "models": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: Required, string, max 100 characters, must be unique

**Error Responses:**
- `400`: Brand name already exists
- `401`: Unauthorized

### 2. Get All Auto Brands

**Endpoint:** `GET /admin/auto-brands`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by brand name
- `sortBy` (optional): Sort field (id, name, createdAt, updatedAt)
- `sortOrder` (optional): Sort order (ASC, DESC)

**Example Request:**
```
GET /admin/auto-brands?page=1&limit=20&search=toy&sortBy=name&sortOrder=ASC
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Toyota",
      "models": [
        {
          "id": 1,
          "name": "Camry"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### 3. Get Auto Brands with Model Count

**Endpoint:** `GET /admin/auto-brands/with-model-count`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Toyota",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "modelCount": 5
  }
]
```

### 4. Get Auto Brand by ID

**Endpoint:** `GET /admin/auto-brands/:id`

**Example Request:**
```
GET /admin/auto-brands/1
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Toyota",
  "models": [
    {
      "id": 1,
      "name": "Camry"
    },
    {
      "id": 2,
      "name": "Corolla"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404`: Auto brand not found
- `401`: Unauthorized

### 5. Update Auto Brand

**Endpoint:** `PATCH /admin/auto-brands/:id`

**Request Body:**
```json
{
  "name": "Toyota Motor Corporation"
}
```

**Response (200):**
```json
{
  "message": "Auto brand updated successfully",
  "data": {
    "id": 1,
    "name": "Toyota Motor Corporation",
    "models": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Brand name already exists
- `404`: Auto brand not found
- `401`: Unauthorized

### 6. Delete Auto Brand

**Endpoint:** `DELETE /admin/auto-brands/:id`

**Response (200):**
```json
{
  "message": "Auto brand deleted successfully"
}
```

**Error Responses:**
- `400`: Cannot delete brand with models
- `404`: Auto brand not found
- `401`: Unauthorized

## Business Logic

### Create Operation
1. Validates brand name uniqueness
2. Creates new auto brand entity
3. Returns created brand with models relation

### Read Operations
1. **findAll**: Supports pagination, search, and sorting
2. **findOne**: Retrieves single brand with models
3. **findBrandsWithModelCount**: Special endpoint for dashboard views

### Update Operation
1. Validates brand exists
2. Checks name uniqueness if changed
3. Updates entity and returns updated data

### Delete Operation
1. Validates brand exists
2. Prevents deletion if brand has models
3. Performs soft delete (sets deletedAt timestamp)

## Data Validation

### Create/Update DTO
```typescript
export class CreateAutoBrandDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
```

### Validation Rules
- **name**: Required, string, max 100 characters
- **Uniqueness**: Brand names must be unique across the system

## Error Handling

### Error Messages
- `errors.AUTO_BRAND.NAME_ALREADY_EXISTS`: Brand name already exists
- `errors.AUTO_BRAND.NOT_FOUND`: Auto brand not found
- `errors.AUTO_BRAND.CANNOT_DELETE_WITH_MODELS`: Cannot delete brand with models

### Success Messages
- `success.AUTO_BRAND.CREATED`: Auto brand created successfully
- `success.AUTO_BRAND.UPDATED`: Auto brand updated successfully
- `success.AUTO_BRAND.DELETED`: Auto brand deleted successfully

## Database Operations

### Soft Delete
- Uses TypeORM's soft delete feature
- Sets `deletedAt` timestamp instead of removing records
- Maintains referential integrity

### Relations
- **One-to-Many** with AutoModels
- Models are loaded when retrieving brands
- Prevents deletion of brands with existing models

## Performance Considerations

### Pagination
- Default page size: 10 items
- Maximum page size: 100 items
- Efficient database queries with skip/take

### Search
- Case-insensitive search using ILike
- Searches only in brand names
- Optimized database queries

### Sorting
- Supports multiple sort fields
- Default sorting by creation date (DESC)
- Efficient database ordering

## Security

### Authentication
- JWT-based authentication required
- Admin access guard protection
- User context available in all operations

### Authorization
- All operations require admin privileges
- User information logged for audit purposes

## Usage Examples

### Frontend Integration

#### Create Brand
```javascript
const response = await fetch('/admin/auto-brands', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Tesla' })
});
```

#### Get Brands with Pagination
```javascript
const response = await fetch('/admin/auto-brands?page=1&limit=20&search=to&sortBy=name&sortOrder=ASC', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### Update Brand
```javascript
const response = await fetch('/admin/auto-brands/1', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Tesla Motors' })
});
```

#### Delete Brand
```javascript
const response = await fetch('/admin/auto-brands/1', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Testing

### Unit Tests
- Service methods testing
- DTO validation testing
- Mapper functionality testing

### Integration Tests
- API endpoint testing
- Database operation testing
- Authentication testing

### Load Testing
- Pagination performance
- Search functionality
- Concurrent operations

## Monitoring and Logging

### Database Logging
- Query execution time monitoring
- Slow query detection
- Performance metrics

### Application Logging
- Operation success/failure logging
- User action tracking
- Error logging with context

## Future Enhancements

### Potential Features
- Bulk operations (create, update, delete)
- Advanced search filters
- Export functionality
- Audit trail
- Brand logo/image support
- Brand description and metadata

### Performance Improvements
- Database indexing optimization
- Query result caching
- Lazy loading for models
- GraphQL support
