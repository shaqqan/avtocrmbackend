# Changelog: Email to Phone Conversion

## Overview
This document summarizes all the changes made to convert the user authentication system from using email addresses to phone numbers.

## Database Changes

### Entity Updates
- **File**: `src/databases/typeorm/entities/user.entity.ts`
- **Change**: Changed `email: string` field to `phone: string` field
- **Constraint**: Maintained unique constraint on phone field

### Migration
- **File**: `src/databases/typeorm/migrations/1754000000000-ChangeEmailToPhone.ts`
- **Purpose**: Database migration to rename email column to phone
- **Operations**:
  - Drop existing unique constraint on email
  - Rename email column to phone
  - Add new unique constraint on phone

## DTO Updates

### Create User DTO
- **File**: `src/modules/admin/user/dto/request/create-user.dto.ts`
- **Changes**:
  - Changed `@IsEmail()` to `@IsPhoneNumber('UZ')`
  - Updated field name from `email` to `phone`
  - Updated API documentation and examples
  - Changed example from email format to phone format (+998901234567)

### Update User DTO
- **File**: `src/modules/admin/user/dto/request/update-user.dto.ts`
- **Changes**: Inherits changes from CreateUserDto (extends PartialType)

### Sign In DTO
- **File**: `src/modules/admin/auth/dto/requests/sign-in.dto.ts`
- **Changes**:
  - Changed `@IsEmail()` to `@IsPhoneNumber('UZ')`
  - Updated field name from `email` to `phone`
  - Updated validation message key from `IS_EMAIL` to `IS_PHONE_NUMBER`
  - Updated API documentation and examples

### Sign Up DTO
- **File**: `src/modules/admin/auth/dto/responses/sign-up.ts`
- **Changes**:
  - Changed `@IsEmail()` to `@IsPhoneNumber('UZ')`
  - Updated field name from `email` to `phone`

### Response DTOs
- **File**: `src/modules/admin/user/dto/response/user.res.dto.ts`
- **Changes**: Updated constructor and properties to use `phone` instead of `email`

- **File**: `src/modules/admin/auth/dto/responses/get-me.ts`
- **Changes**: Updated constructor and properties to use `phone` instead of `email`

## Service Updates

### User Service
- **File**: `src/modules/admin/user/user.service.ts`
- **Changes**:
  - Updated create method: changed email validation to phone validation
  - Updated findAll method: changed email sorting and search to phone
  - Updated update method: changed email uniqueness check to phone
  - Updated error messages: changed `EMAIL_ALREADY_EXISTS` to `PHONE_ALREADY_EXISTS`

### Auth Service
- **File**: `src/modules/admin/auth/auth.service.ts`
- **Changes**:
  - Updated signIn method: changed email lookup to phone lookup
  - Updated generateTokens method: changed JWT payload from email to phone

## Mapper Updates

### User Mapper
- **File**: `src/modules/admin/user/mapper/user.mapper.ts`
- **Changes**: Updated toDto method to map `phone` instead of `email`

## Strategy Updates

### JWT Admin Access Strategy
- **File**: `src/common/strategies/admin/jwt-admin-accsess.strategy.ts`
- **Changes**: Updated user lookup to select `phone` instead of `email`

## Seeder Updates

### User Seeder
- **File**: `src/databases/typeorm/seeds/user.seeder.ts`
- **Changes**: Updated sample user data from email to phone number

## Validation Updates

### Error Message Keys
- **Changed**: `errors.USER.EMAIL_ALREADY_EXISTS` → `errors.USER.PHONE_ALREADY_EXISTS`
- **Changed**: `errors.VALIDATION.IS_EMAIL` → `errors.VALIDATION.IS_PHONE_NUMBER`

## Phone Number Format
- **Country Code**: Uzbekistan (UZ)
- **Format**: +998901234567
- **Validation**: Using `@IsPhoneNumber('UZ')` decorator

## Breaking Changes
1. **Database Schema**: Existing email column will be renamed to phone
2. **API Contracts**: All endpoints now expect phone instead of email
3. **Validation**: Phone numbers must be in valid Uzbekistan format
4. **Authentication**: JWT tokens now contain phone instead of email

## Migration Instructions
1. **Development**: Run the application - TypeORM will auto-sync the schema
2. **Production**: Run the migration: `npm run migration:run`
3. **Rollback**: Use the down method in the migration if needed

## Testing Required
- User creation with phone numbers
- User authentication with phone numbers
- User search and filtering by phone
- User updates with phone number changes
- JWT token generation and validation
- Database constraints and uniqueness

## Notes
- All existing email-based functionality has been converted to phone-based
- Phone numbers are validated using Uzbekistan country code (UZ)
- Unique constraint maintained on phone field
- All related logging and error messages updated accordingly
